import { APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';
import { ObjectId } from 'bson';
import { config } from 'dotenv';

import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { fromIni } from '@aws-sdk/credential-providers';
import { HttpRequest } from '@smithy/protocol-http';
import { parseUrl } from '@smithy/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { Hash } from '@aws-sdk/hash-node';
import sendgrid from '@sendgrid/mail';

import BaseService from '../base/base-service';
import { emailTemplate } from './email-template';
import { PaypalRoutes, ServerErrors } from '../../declarations/enums';
import {
  Order,
  PaypalResult,
  SendEmailResult,
  User,
} from '@declarations/order';
import { RouteMap } from '@declarations/routing';
import { WhichTemplate } from '@declarations/which-email';

config();
const configuration = { region: 'us-east-1' };
const sqs = new SQSClient(configuration);

export default class PaypalService extends BaseService<Order> {
  /**
   * Route Maps are a building block of routing in Rapid Back-End. Hashmaps of RESTful verbs make key/value pairs of more maps whose
   * key/value pairs are methodNames/route parameters. Each route parameter
   * is defined in an enum to help prevent "magic strings". Notice below that
   * each method on this class has a corresponding key under one of the
   * RESTful verbs. This is how the actual mapping is made possible.
   */
  private static routeMap: RouteMap = {
    POST: {
      sendEmail: PaypalRoutes.order,
    },
  };

  public body: {
    firstName: string;
    lastName: string;
    email: string;
    orderData: PaypalResult;
    affiliateId: string;
  };

  public productToTemplate = {
    1: 'pyl',
    2: 'rb',
    3: 'consult',
  };

  public event: APIGatewayEvent;
  private senderEmailAddress = 'gtngbooks@gmail.com';

  constructor(event: APIGatewayProxyEvent) {
    super(event, PaypalService.routeMap);
    this.body = JSON.parse(event.body);
    this.event = event;
    sendgrid.setApiKey(process.env.SEND_GRID_API_KEY as string);
  }

  async sendEmail(): Promise<SendEmailResult> {
    let link;
    const { email, firstName, lastName, orderData, affiliateId } = this.body;
    try {
      link = await this.createPresignedUrlWithoutClient(orderData.id);
    } catch (e) {
      console.log('SIGNING URL ', e);
    }

    if (link === undefined) {
      await this.sendToDeadLetterQueue(
        this.event,
        ServerErrors.failedToMakeLink
      );
      throw new Error(ServerErrors.failedToMakeLink);
    }

    const user: User = {
      _id: new ObjectId(),
      firstName,
      lastName,
      email,
      city: orderData.purchase_units[0].shipping.address.admin_area_2,
      state: orderData.purchase_units[0].shipping.address.admin_area_1,
      affiliateId,
    };
    let emailSendResult;

    try {
      const [boughtPyl, boughtRb, boughtConsult] = this.whichEmail(
        orderData.purchase_units
      );

      if (boughtConsult) {
        //Todo: Write code to fetch one-time link from calendly
      }

      emailSendResult = await sendgrid.send({
        to: email,
        from: this.senderEmailAddress,
        subject: 'Rapid Back-End PDF',
        html: emailTemplate(
          link,
          orderData.id,
          firstName,
          boughtPyl,
          boughtRb,
          boughtConsult,
          ''
        ),
      });
      console.log('Email sent successfully:');
    } catch (e) {
      console.log(
        `${ServerErrors.failedToSendBook} for order ${orderData.id}`,
        e
      );

      await this.addOrder(orderData.id, user, null, link, false);
      this.sendToDeadLetterQueue(this.event, ServerErrors.failedToSendBook);

      throw new Error(`
        Payment processed but we failed to send your eBook! 
        Please contact support at ${this.senderEmailAddress} and 
        provide this orderId: ${orderData.id}`);
    }

    try {
      await this.addOrder(
        orderData.id,
        user,
        emailSendResult.MessageId,
        link,
        true
      );
    } catch (e) {
      this.sendToDeadLetterQueue(this.event, ServerErrors.failedToSaveToDB);
      console.log({
        ...user,
        userId: user._id,
        orderId: orderData.id,
        paid: true,
        link,
        sent: true,
        emailMessageId: emailSendResult.MessageId,
      });
      console.log(ServerErrors.failedToSaveToDB);
      console.log(e);
    }

    return {
      body: 'Email Sent!',
      user: user,
      headers: {},
      multiValueHeaders: {},
    };
  }

  async addOrder(
    orderId: string,
    user: any,
    emailMessageId: string | null,
    link: string,
    sent: boolean
  ) {
    await this.create({
      Bucket: 'rapidbackend',
      Key: `${
        process.env.NODE_ENV === 'development' ? 'development-' : ''
      }orders/${user._id}.json`,
      Body: JSON.stringify({
        ...user,
        userId: user._id,
        orderId,
        paid: true,
        link,
        sent,
        emailMessageId,
      }),
    });
  }

  async sendToDeadLetterQueue(
    event: APIGatewayEvent,
    title: string
  ): Promise<void> {
    const message = JSON.stringify(event);
    const command = new SendMessageCommand({
      QueueUrl: process.env.DEAD_LETTER_QUEUE_URL as string,
      MessageAttributes: {
        Title: {
          DataType: 'String',
          StringValue: title,
        },
      },
      MessageBody: message,
    });

    try {
      await sqs.send(command);
    } catch (e) {
      console.log('DEAD LETTER QUEUE ERROR', e);
      console.log('Message dropped: ', title, event);
      throw new Error(ServerErrors.ItBroke);
    }
  }

  async createPresignedUrlWithoutClient(orderId: string): Promise<string> {
    const url = parseUrl(
      `https://rapidbackend.s3.amazonaws.com/rapid-back-end-ebook.pdf`
    );

    // * I worked all day on this. the fromIni() only works locally, and My syntax was off for the credentials (wasn't camel casing the key names was using ACCESS_KEY_ID instead)
    const presigner = new S3RequestPresigner({
      credentials:
        process.env.NODE_ENV === 'production'
          ? {
              accessKeyId: process.env.ACCESS_KEY_ID,
              secretAccessKey: process.env.SECRET_ACCESS_KEY,
            }
          : fromIni(),
      region: 'us-east-1',
      sha256: Hash.bind(null, 'sha256'),
    });

    const signedUrlObject = await presigner.presign(
      new HttpRequest({ ...url, method: 'GET', query: { orderId } }),
      { expiresIn: 259200 }
    );

    return formatUrl(signedUrlObject);
  }

  whichEmail(purchaseUnits: PaypalResult['purchase_units']): WhichTemplate {
    const boughtMap = {
      pyl: false,
      rb: false,
      consult: false,
    };

    purchaseUnits.forEach((curr, i) => {
      const id = parseInt(curr.reference_id.split('-')[0]);
      boughtMap[this.productToTemplate[id]] = true;
    });

    return [
      boughtMap.pyl,
      boughtMap.rb,
      boughtMap.consult,
    ];
  }

  async fetchCalendlySchedulingLink(): Promise<string> {
    return '';
  }
}
