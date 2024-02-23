import * as path from 'path';
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import {
  LambdaIntegration,
  LambdaRestApi,
  AccessLogFormat,
  LogGroupLogDestination,
  MethodLoggingLevel,
} from 'aws-cdk-lib/aws-apigateway';
import {
  StarPrincipal,
  Effect,
  PolicyDocument,
  PolicyStatement,
} from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export default class BackendService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const functions: { [s: string]: Function } = {};

    const functionNames = [
      `JngPaypal${process.env.NODE_ENV === 'prod' ? '' : '-staging'}`,
    ];

    const rapidbackendBucket = Bucket.fromBucketName(
      this,
      'RapidBackEndBucket',
      'rapidbackend'
    );

    const jngwebsiteBucket = Bucket.fromBucketName(
      this,
      'JngWebsiteBucket',
      'jahanaeemgitongawebsite'
    );

    // * create dead letter queue for lambda
    const deadLetterQueue = new Queue(this, 'dead-letter-queue', {
      retentionPeriod: Duration.days(14),
    });

    // * Define an IAM policy statement for writing to the SQS queue
    const sqsPermission = new PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [deadLetterQueue.queueArn],
    });

    const environment: { [s: string]: {} } = {
      all: {
        WHICH_ROUTE: process.env.WHICH_ROUTE as string,
        NODE_ENV: process.env.NODE_ENV as string,
        STAGE: process.env.STAGE as string,
        CLIENT_ID: process.env.CLIENT_ID as string,
        PAY_PAL_URL: process.env.PAY_PAL_URL as string,
        ACCESS_KEY_ID: process.env.ACCESS_KEY_ID as string,
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY as string,
        DEAD_LETTER_QUEUE_URL: deadLetterQueue.queueUrl,
        SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY as string,
        CALENDLY_API_ACCESS_TOKEN: process.env
          .CALENDLY_API_ACCESS_TOKEN as string,
      },
    };

    functionNames.forEach((name: string) => {
      const nameLowerCased = name.toLowerCase();
      const nameWithoutStage = nameLowerCased.split('-')[0];
      console.log({ nameLowerCased, name, nameWithoutStage });
      const lambda = new Function(this, name, {
        functionName: nameLowerCased,
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler.paypal',
        environment: {
          ...(environment[nameWithoutStage] && environment[nameWithoutStage]),
          ...environment.all,
        },
        timeout: Duration.minutes(10),
        code: Code.fromAsset(
          path.join(__dirname, '../../apis/.serverless/jngpaypal.zip') // * change this filename once you change the service prop in /backend/serverless.yml
        ),
      });

      rapidbackendBucket.grantRead(lambda);
      jngwebsiteBucket.grantRead(lambda);

      const policyStatementRb = new PolicyStatement({
        sid: 'S3GetObject',
        actions: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
        resources: ['arn:aws:s3:::rapidbackend', 'arn:aws:s3:::rapidbackend/*'],
      });

      const policyStatementJng = new PolicyStatement({
        sid: 'S3GetObjectJng',
        actions: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
        resources: [
          'arn:aws:s3:::jahanaeemgitongawebsite',
          'arn:aws:s3:::jahanaeemgitongawebsite/*',
        ],
      });

      lambda.addToRolePolicy(policyStatementRb);
      lambda.addToRolePolicy(policyStatementJng);
      lambda.addToRolePolicy(sqsPermission);
      functions[nameLowerCased] = lambda;
    });

    // const deployStage = process.env.DEPLOY_STAGE; //? I May bring this back to conditionally set the condition to use my IP Address

    let conditions: any = {
      StringEquals: {
        'aws:Referer': [
          'https://www.jahanaeemgitonga.com/*',
          'https://www.jahanaeemgitonga.com/',
          'https://www.staging.jahanaeemgitonga.com/*',
          'https://www.staging.jahanaeemgitonga.com/',
          'https://jahanaeemgitonga.com/',
          'https://jahanaeemgitonga.com/*',
          'https://staging.jahanaeemgitonga.com/*',
          'https://staging.jahanaeemgitonga.com/',
        ],
      },
      // IpAddress: {
      //   'aws:SourceIp': [process.env.IP_ADDRESS], // * add your ip address here. make sure that you have the correct ip address or you will see something like this {"Message":"User: anonymous is not authorized to perform: execute-api:Invoke on resource: arn:aws:execute-api:us-east-1:********6173:1crdeqdfq4/prod/GET/api/lambdaa"}
      //  },
    };

    const apiResourcePolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new StarPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: [`arn:aws:execute-api:*:*:*/prod/*/api/jngpaypal*`],
          conditions,
        }),
      ],
    });

    // * create log group for backend api gateway logs
    const prdLogGroup = new LogGroup(this, 'jng-backend-log-group', {
      removalPolicy:
        process.env.NODE_ENV === 'prod'
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
      logGroupName: `jng-backend-log-group${process.env.NODE_ENV === 'prod' ? '' : '-staging'}`,
    });

    const api = new LambdaRestApi(
      this,
      `jng-backend-api-gateway${process.env.NODE_ENV === 'prod' ? '' : '-staging'}`,
      {
        handler:
          functions[
            `jngpaypal${process.env.NODE_ENV === 'prod' ? '' : '-staging'}`
          ],
        proxy: false,
        deployOptions: {
          stageName: '',
          metricsEnabled: true,
          loggingLevel: MethodLoggingLevel.INFO,
          accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
          accessLogDestination: new LogGroupLogDestination(prdLogGroup),
        },
        policy: apiResourcePolicy,
        defaultCorsPreflightOptions: {
          allowCredentials: true,
          allowOrigins: [
            process.env.NODE_ENV === 'prod'
              ? 'https://jahanaeemgitonga.com'
              : 'https://staging.jahanaeemgitonga.com',
          ],
          allowHeaders: ['*'],
          allowMethods: ['POST', 'OPTIONS'],
        },
      }
    );

    const basePath = api.root.addResource('api');

    functionNames.forEach((name: string) => {
      const nameLowerCased = name.toLowerCase();
      const slashApiSlashNameRoutes = basePath.addResource(nameLowerCased); // * this makes routes like: /api/auth, /api/lambdaa, or /api/lambdab
      const slashApiSlashNameSlashProxyPlus =
        slashApiSlashNameRoutes.addResource('{proxy+}'); // * this makes routes like: /api/auth/{proxy+}, etc.;

      // * now add all RESTful verbs  to both routes that we made
      ['POST'].forEach((m: string) => {
        slashApiSlashNameRoutes.addMethod(
          m,
          new LambdaIntegration(functions[nameLowerCased])
        ); // * now add all RESTful verbs

        slashApiSlashNameSlashProxyPlus.addMethod(
          m,
          new LambdaIntegration(functions[nameLowerCased])
        ); // * now add all RESTful verbs
      });
    });
  }
}
