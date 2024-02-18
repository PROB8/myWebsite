# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template



### LESSONS

####Sun Aug 13, 2023 
All day I have been dealing with errors from the compiler saying stuff like
"[ts] .forEach doesn't exists on typ string[]" 
All of that because i wasn't importing the correct library in my `tsconfig.json`.