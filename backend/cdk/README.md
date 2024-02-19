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

###Mon Feb 19, 2024

I saw the following error:
```
$ cdk synth

This CDK CLI is not compatible with the CDK library used by your application. Please upgrade the CLI to the latest version.
(Cloud assembly schema version mismatch: Maximum schema version supported is 34.0.0, but found 36.0.0)
```

The solution was the following:

```
$ which cdk
/Users/jahagitonga/.nvm/versions/node/v18.16.0/bin/cdk

jahagitonga at GTNG-Mac in ~/projects/myWebsite/backend/cdk (staging●)
$ rm -rf /Users/jahagitonga/.nvm/versions/node/v18.16.0/bin/cdk

jahagitonga at GTNG-Mac in ~/projects/myWebsite/backend/cdk (staging●)
$ npm install -g aws-cdk@latest

changed 2 packages in 1s

jahagitonga at GTNG-Mac in ~/projects/myWebsite/backend/cdk (staging●)
$ which cdk
/Users/jahagitonga/.nvm/versions/node/v20.11.1/bin/cdk
```

Eventhough I had installed the latest, the version of cdk that was being used was on my node 18 version (tied to it)
I needed to remove that and install it fresh.
