import { CardsController } from '../app/controller/cards';
import { cards } from '../app/model';
import { Context, APIGatewayProxyEvent } from 'aws-lambda';

let ev: APIGatewayProxyEvent = {
  body: '',
  pathParameters: null,
  headers: undefined,
  multiValueHeaders: undefined,
  httpMethod: '',
  isBase64Encoded: false,
  path: '',
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: undefined,
  resource: '',
  queryStringParameters: null
};

let context: Context = {
  functionName: 'create',
  callbackWaitsForEmptyEventLoop: false,
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: function (): number {
    throw new Error('Function not implemented.');
  },
  done: function (error?: Error | undefined, result?: any): void {
    throw new Error('Function not implemented.');
  },
  fail: function (error: string | Error): void {
    throw new Error('Function not implemented.');
  },
  succeed: function (messageOrObject: any): void {
    throw new Error('Function not implemented.');
  }
};

describe('CardsController', () => {
  describe('create', () => {
    it('Should return an object', async () => {
      ev.pathParameters = { token: 'JEJH8aQ3ENm0Wx2O' };
    });
    const controller = new CardsController(cards);
    const response = controller.create(ev, context);
    expect(typeof response).toBe('object');
  });
});
