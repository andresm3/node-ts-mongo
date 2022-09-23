import { Context } from 'aws-lambda';
import { Model } from 'mongoose';
import { MessageUtil } from '../utils/message';
import { CardsService } from '../service/cards';
import { CreateCardDTO } from '../model/dto/createCardDTO';
import Ajv, { JSONSchemaType } from 'ajv';
const randomstring = require('randomstring');
const ajv = new Ajv();

interface MyData {
  email: string;
  card_number: string;
  cvv: number;
  expiration_year: string;
  expiration_month: string;
}

const schema: JSONSchemaType<MyData> = {
  type: 'object',
  properties: {
    card_number: {
      type: 'string',
      pattern: '^[0-9]+$',
      minLength: 13,
      maxLength: 16,
    },
    cvv: {
      type: 'number',
      pattern: '^[0-9]+$',
      minLength: 3,
      maxLength: 4,
    },
    expiration_month: {
      type: 'string',
      pattern: '^[0-9]+$',
      minLength: 1,
      maxLength: 2,
    },
    expiration_year: {
      type: 'string',
      pattern: '^[0-9]+$',
      minLength: 4,
      maxLength: 4,
    },
    email: {
      type: 'string',
      pattern: '^[A-Za-z0-9-@_.]+$',
      minLength: 5,
      maxLength: 100,
    }
  },
  required: [
    'email',
    'expiration_year',
    'expiration_month',
    'cvv',
    'card_number'
  ],
  additionalProperties: false
};

export class CardsController extends CardsService {
  constructor (cards: Model<any>) {
    super(cards);
  }

  /**
   * Create book
   * @param {*} event
   */
  async create (event: any, context: Context) {
    console.log('functionName', context.functionName);
    console.log('>>>event: ', event);
    const params: CreateCardDTO = JSON.parse(event.body);

    try {
      const validate = ajv.compile(schema);
      const valid = validate(JSON.parse(event.body));

      if (!valid) {
        console.log('Parametros recibidos no son validos: ', validate.errors);
        return MessageUtil.error(400, JSON.stringify(validate.errors));
      }

      // validate token
      const validToken = typeof(event.headers?.Authorization) != 'undefined' ? 
        await this.validateToken(event.headers?.Authorization) : false;
      if (!validToken) {
        return MessageUtil.error(400, 'Pk invalido');
      }

      //validate luhn
      if (!await this.validateLuhn(params.card_number)) {
        return MessageUtil.error(400, 'CC number is not valid');
      }

      //validate exp year
      if (!await this.validateExpirationYear(Number(params.expiration_year))) {
        return MessageUtil.error(400, 'Expiration year is not valid');
      }

      //validate email
      if (!await this.validateEmail(params.email)) {
        return MessageUtil.error(400, 'Email is not valid');
      }

      const result = await this.createCard({
        email: params.email,
        card_number: params.card_number,
        cvv: params.cvv,
        expiration_year: params.expiration_year,
        expiration_month: params.expiration_month,
        token: randomstring.generate(16),
      });
      
      return MessageUtil.success(result);
    } catch (err) {
      console.error('::Error>> ', err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  /**
   * Query card by token
   * @param event
   */
  async findOne (event: any, context: Context) {
    // The amount of memory allocated for the function
    console.log('memoryLimitInMB: ', context.memoryLimitInMB);
    console.log('>>>event: ', event);

    const token: string = event.pathParameters.token;
    console.log('>>>token: ', token);

    try {
      // validate token
      const validToken = typeof(event.headers?.Authorization) != 'undefined' ? await this.validateToken(event.headers?.Authorization) : false;
      if (!validToken) {
        console.log('Pk invalido: ');
        return MessageUtil.error(400, 'Pk invalido');
      }

      const result = await this.findOneCardByToken(token);

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

}
