import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ApiLambdaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTable = new Table(this, 'items', {
      partitionKey: {
        name: 'itemId',
        type: AttributeType.STRING
      },
      tableName: 'items',
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });


    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, '..', 'package-lock.json'),
      environment: {
        PRIMARY_KEY: 'itemId',
        TABLE_NAME: dynamoTable.tableName,
      },
      runtime: Runtime.NODEJS_14_X,
    }
    
    const createOneLambda = new NodejsFunction(this, 'createItemFunction', {
      entry: join(__dirname,'..', 'lambdas', 'create.ts'),
      ...nodeJsFunctionProps,
    });

    const getOneLambda = new NodejsFunction(this, 'getOneItemFunction', {
      entry: join(__dirname,'..', 'lambdas', 'get-one.ts'),
      ...nodeJsFunctionProps,
    });
    const getAllLambda = new NodejsFunction(this, 'getAllItemFunction', {
      entry: join(__dirname,'..', 'lambdas', 'get-all.ts'),
      ...nodeJsFunctionProps,
    });

    const updateLambda = new NodejsFunction(this, 'updateItemFunction', {
      entry: join(__dirname,'..', 'lambdas', 'update.ts'),
      ...nodeJsFunctionProps,
    });
    const deleteLambda = new NodejsFunction(this, 'deleteItemFunction', {
      entry: join(__dirname,'..', 'lambdas', 'delete.ts'),
      ...nodeJsFunctionProps,
    });


    dynamoTable.grantReadWriteData(createOneLambda);
    dynamoTable.grantReadWriteData(getAllLambda);
    dynamoTable.grantReadWriteData(getOneLambda);
    dynamoTable.grantReadWriteData(updateLambda);
    dynamoTable.grantReadWriteData(deleteLambda);

    const createOneIntegration = new LambdaIntegration(createOneLambda);
    const getOneIntegration = new LambdaIntegration(getOneLambda);
    const getAllIntegration = new LambdaIntegration(getAllLambda);
    const updateIntegration = new LambdaIntegration(updateLambda);
    const deleteIntegration = new LambdaIntegration(deleteLambda);
    
    const api = new RestApi(this, 'itemsApi', {
      restApiName: 'Items Service'
    });

    const items = api.root.addResource('items');
    items.addMethod('GET', getAllIntegration);
    items.addMethod('POST', createOneIntegration);
    addCorsOptions(items);


    const single = items.addResource('{id}');
    single.addMethod('GET', getOneIntegration);
    single.addMethod('PUT', updateIntegration);
    single.addMethod('DELETE', deleteIntegration);
    addCorsOptions(single);
  }
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}
