import { APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';
import BaseService from '../base/base-service';
import { User } from '@declarations/order';

export default class UserService extends BaseService<User> {
  public body: unknown;
  public event: APIGatewayEvent;

  constructor(event: APIGatewayProxyEvent) {
    super(event);
    this.body = JSON.parse(event.body);
    this.event = event;
  }

  async createUser(payload: User): Promise<unknown> {
    const result = await this.create({
      Bucket: 'rapidbackend',
      Key: `${
        process.env.NODE_ENV === 'development' ? 'development-' : ''
      }users/${payload._id}.json`,
      Body: JSON.stringify(payload),
    });
    return result;
  }
}
