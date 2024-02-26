import { APIGatewayEvent } from 'aws-lambda';

import PaypalService from '../paypal-service';

describe('LambdaA service tests', () => {
  beforeAll(async () => {
    try {
    } catch (e) {
      console.log(e);
      throw new Error(e.errmsg);
    }
  });

  afterAll(async () => {
    try {
    } catch (e) {
      console.log(e);
      throw new Error(e.errmsg);
    }
  });

  test('Should map request to method for singleton route: ', () => {
    const mockEvent = {
      path: '/api/jngpaypal/order',
      httpMethod: 'POST',
      body: JSON.stringify({}),
    } as APIGatewayEvent;

    const loadsService = new PaypalService(mockEvent);
    expect(loadsService.mapRequestRouteToMethod()).toBe('sendEmail');
  });
});
