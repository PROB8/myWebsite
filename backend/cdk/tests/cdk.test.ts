import { App, Stack } from 'aws-cdk-lib';
import BackendStack from '../lib/backend-stack';
import { Template } from 'aws-cdk-lib/assertions';
// import * as fs from 'fs'

describe('Test for constructs created', (): void => {
  let stack: Stack;
  beforeAll((): void => {
    const app = new App();
    process.env.NODE_ENV = 'staging';
    process.env.ARTIFACT_PATH = '../../apis/.serverless/jngpaypal-staging.zip';
    stack = new BackendStack(app, 'BackendStackTest', {
      env: { account: '00000000', region: 'us-east-2' },
    });
  });

  it('Stack created an IAM role', (): void => {
    const template = Template.fromStack(stack);
    // fs.writeFileSync('template.json', JSON.stringify(template), 'utf-8')
    template.hasResourceProperties('AWS::IAM::Role', {});
    template.resourceCountIs('AWS::IAM::Role', 2);
  });
});
