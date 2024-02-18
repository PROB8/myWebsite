import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import BackendService from '../lib/backend-service';

export default class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new BackendService(this, 'rapid-backend-paypal-service');
  }
}
