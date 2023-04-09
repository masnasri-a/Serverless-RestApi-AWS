# Welcome to your CDK TypeScript project
AWS API Gateway to create a RESTful API that sends requests to AWS Lambda functions written in Node.js. 
These functions perform CRUD operations on a DynamoDB table to store and retrieve data for the application.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


## Preparataion

 * https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
 * `npm install aws-cdk-lib` install AWS CDK 
  
## To create an AWS (Amazon Web Services) account and generate an access key, follow these steps:

- Go to the AWS website: https://aws.amazon.com/.
- Click on the "Create an AWS Account" button.
- Fill out the registration form with your personal information, including your name, email address, and a password.
- Enter your payment information to set up billing (you will not be charged until you use AWS services).
- Choose the AWS Support Plan you want (either basic or developer).
- Review and accept the AWS Customer Agreement and click on the "Create Account and Continue" button.
- You will receive an email from AWS asking you to verify your email address. Follow the instructions in the email to verify your email address.
- Once you have verified your email address, you will be redirected to the AWS Management Console. From here, you can start using AWS services.

 ### To create an access key:

- Log in to the AWS Management Console.
- Click on your account name in the top right corner and select "My Security Credentials" from the drop-down menu.
- Click on the "Access keys (access key ID and secret access key)" option in the left-hand menu.
- Click on the "Create New Access Key" button.
- Your new access key ID and secret access key will be displayed. Make note of these values as you will need them to access AWS services programmatically.
- Click on the "Download Key File" button to download a CSV file containing your access key ID and secret access key.
- type this code on terminal ```aws configure```
- and insert data into aws configuration