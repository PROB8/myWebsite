import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import { ServerErrors } from '../../declarations/enums';
import PaypalService from './paypal-service';
import response from '../base/response';
import UserService from '../user/user-service';
import { SendEmailResult } from '@declarations/order';

export const paypal: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log(process.env.NODE_ENV);
  const paypalService = new PaypalService(event);
  let paypalResponse: SendEmailResult;
  try {
    const whichMethod = paypalService.mapRequestRouteToMethod();
    paypalResponse = await paypalService[whichMethod]();
  } catch (e) {
    console.log(e);
    return response(ServerErrors.ItBroke, 500, e);
  }

  try {
    const userService = new UserService(event);
    const { user } = paypalResponse;
    userService.createUser(user);
  } catch (e) {
    console.log(e);
  }

  const { body, headers, multiValueHeaders } = paypalResponse;
  return response(body, 200, undefined, headers, multiValueHeaders);
};
