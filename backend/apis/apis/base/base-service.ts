import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { ObjectId } from 'bson';
import { ParamMap, RouteMap } from '@declarations/routing';
import { ServerErrors } from '../../declarations/enums';

const s3Client = new S3Client({});
/**
 * Base service is the service from which all microservices that are exposed to the internet extend.
 */
export default class BaseService<T> {
  public path: string;
  public method: string;
  public routeMap: RouteMap;
  /**
   * regex is  a sort of list of various dynamic route parameters that your routes could have. These would be ObjectIds
   */
  private regex = RegExp(/({id}|{userId}|{caseId})/gm);
  //* this may help us if we have routes with multiple route params
  //* in your service you can refer to this using this.paramMap
  //* as a lookup table
  private paramMap: ParamMap = {};

  constructor(event: APIGatewayProxyEvent, routeMap?: RouteMap) {
    this.path = event.path;
    this.method = event.httpMethod;
    this.routeMap = routeMap;
  }

  /**
   * @description finds the method used to process the request based on the request's route.
   * @returns string
   */
  public mapRequestRouteToMethod(): string {
    const group = this.routeMap[this.method];
    for (const [routeName, routePath] of Object.entries(group)) {
      if (routePath === this.path) {
        return routeName;
      }

      const brokenTablePath = (routePath as string).split('/');
      const brokenEventPath = this.path.split('/');
      const isPath = this.compareRoutePaths(brokenTablePath, brokenEventPath);
      if (isPath) {
        return routeName;
      }
    }
    throw new Error(`${ServerErrors.RouteNotFound} ${this.path}`);
  }

  /**
   * @description This method vets the request that has come into the lambda to see if the lambda should process it base on the route parameters.
   * @returns boolean
   */
  private compareRoutePaths(
    thePath: string[],
    incomingPath: string[]
  ): boolean {
    if (incomingPath.length !== thePath.length) {
      return false;
    }

    let isPath = true;
    thePath.forEach((param, i) => {
      if (!isPath) return;
      if (this.regex.test(param)) {
        // ? does your route have dynamic parameters that need to be tested for valid ObjectIds.
        try {
          // * our other route tables had the
          // * routes with the route parameters not
          // * listed first in the object and if it
          // * encountered one without a
          // * single String of 12 bytes or a string of 24 hex characters
          // * it would blow up the program.
          // * here we test it first and if it blows up we
          // * know we don't have a match
          new ObjectId(incomingPath[i]);
        } catch (e) {
          isPath = false;
          return;
        }
        this.paramMap = {
          ...this.paramMap,
          [param]: new ObjectId(incomingPath[i]),
        };
        isPath = true;
        return;
      }

      if (param === incomingPath[i]) {
        isPath = true;
        return;
      }

      isPath = false;
    });
    return isPath;
  }

  /**
   *
   * @param filter used to get the object from the s3 bucket
   * @param _projection is deprecated and is a relic of the past when we were using MongoDB, may come back in the future
   * @returns a parsed JSON array
   */
  public async get(
    filter: { Bucket: string; Key: string },
    _projection = {}
  ): Promise<T[]> {
    const command = new GetObjectCommand(filter);
    const response = await s3Client.send(command);
    const string = await response.Body.transformToString();
    return JSON.parse(string) as T[];
  }

  public async create(filter: {
    Bucket: string;
    Key: string;
    Body: string;
  }): Promise<unknown> {
    const command = new PutObjectCommand(filter);
    const response = await s3Client.send(command);
    return response;
  }

  /**
   * @description This will take your parameters and convert them to the correct/intended data type
   */
  public handleFilter(filter: { [name: string]: unknown }): {
    [name: string]: unknown;
  } {
    // * for each query param that you want to to use,
    // * if in your application you need it to be something other
    // * than a string, you can add it here and create a method
    // * to convert it to whatever you need it to be.
    const paramsToFunctionMap = {
      deleted: toBoolean,
      checkin: toDate,
      id: toObjectId,
      page: toInt,
      role: toInt,
    };

    function toInt(key: string): void {
      filter[key] = parseInt(filter[key] as string);
    }

    function toBoolean(key: string) {
      if (filter[key] === 'false') {
        filter[key] = false;
      } else if (filter[key] === 'true') {
        filter[key] = true;
      }
    }

    function toDate(key: string): void {
      filter[key] = new Date(filter[key] as string);
    }

    function toObjectId(key: string) {
      filter[key] = new ObjectId(filter[key] as string);
    }

    const filterKeys = Object.keys(filter);
    filterKeys.forEach((k: string) => {
      if (paramsToFunctionMap[k]) {
        paramsToFunctionMap[k](k);
      }
    });

    if (filter.objectIds) {
      filter.objectIds = (filter.objectIds as string)
        .split(',')
        .map((id) => new ObjectId(id));
    }

    return filter;
  }

  public getAllIds() {
    return this.paramMap;
  }
}
