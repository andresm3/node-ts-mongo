
import { Handler, Context } from 'aws-lambda';
import dotenv from 'dotenv';
import path from 'path';
const dotenvPath = path.join(__dirname, '../', `config/.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

import { cards } from './model';
import { CardsController } from './controller/cards';
const cardsController = new CardsController(cards);

export const create: Handler = (event: any, context: Context) => {
  return cardsController.create(event, context);
};

export const findOne: Handler = (event: any, context: Context) => {
  return cardsController.findOne(event, context);
};
