import { Collection } from 'mongodb';
import { APIGatewayProxyEvent } from 'aws-lambda';

import BaseService from '../base-service';
import response from '../response';
import { RouteMap } from '../../../declarations/routing';

describe('Base service tests', () => {
  let baseService;
  const event = {
    queryStringParameters: {
      id: 123,
      role: '4',
      page: '3',
      companyType: '1',
    },
  };
  beforeEach(() => {
    baseService = new BaseService<unknown>(
      event as unknown as APIGatewayProxyEvent,
      {} as Collection,
      { GET: { happy: '/asdf' } } as RouteMap
    );
  });

  const log = console.log;
  afterEach(() => {
    console.log = log;
  });

  it('Event param role should be of type number: ', async () => {
    const filter = baseService.handleFilter(event.queryStringParameters);
    expect('role' in filter).toBeTruthy();

    expect(filter.role).toBe(4);
    expect(typeof filter.role).toBe('number');
  });

  it('Event param page should be of type number: ', async () => {
    const filter = baseService.handleFilter(event.queryStringParameters);
    expect('page' in filter).toBeTruthy();
    expect(filter.page).toBe(3);
    expect(typeof filter.page).toBe('number');
  });

  it('Event param objectIds should be of type object: ', async () => {
    const event = {
      queryStringParameters: {
        objectIds: '5ffe4e2ed105ebcca53857a6,6008de563bc7b17408673dd7',
      },
    };
    const filter = baseService.handleFilter(event.queryStringParameters);
    expect('objectIds' in filter).toBeTruthy();
    expect(typeof filter.objectIds[0]).toBe('object');
    expect(typeof filter.objectIds[1]).toBe('object');
  });

  it('Event param deleted should be of type boolean: ', async () => {
    const event = {
      queryStringParameters: {
        deleted: 'false',
      },
    };
    const filter = baseService.handleFilter(event.queryStringParameters);
    expect('deleted' in filter).toBeTruthy();
    expect(typeof filter.deleted).toBe('boolean');
  });

  it('Event param deleted should be of type boolean: ', async () => {
    const event = {
      queryStringParameters: {
        deleted: 'true',
      },
    };
    const filter = baseService.handleFilter(event.queryStringParameters);
    expect('deleted' in filter).toBeTruthy();
    expect(typeof filter.deleted).toBe('boolean');
  });

  it('Body property should have type of string: ', async () => {
    const res = await response({ dog: 'bark' }, 200);
    expect(typeof res.body).toBe('string');
  });

  it('Should have a header: ', async () => {
    const cookie = {
      'Access-Control-Allow-Credentials': true,
      'set-cookie': 'mywonderful=cookie',
    };
    const res = await response({ dog: 'bark' }, 200, undefined, cookie);
    expect(JSON.stringify(res.headers)).toEqual(JSON.stringify(cookie));
  });

  it('Should have a multivalue header: ', async () => {
    const multivalueheaders = {
      'set-cookie': ['mywonderful=cookie', 'myotherwonderful=cookietoo'],
    };
    const res = await response(
      { dog: 'bark' },
      200,
      undefined,
      {},
      multivalueheaders
    );
    expect(JSON.stringify(res.multiValueHeaders)).toEqual(
      JSON.stringify(multivalueheaders)
    );
  });
});
