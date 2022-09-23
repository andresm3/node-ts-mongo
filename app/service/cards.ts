import { Model } from 'mongoose';
import { CreateCardDTO } from '../model/dto/createCardDTO';
const Luhn = require('luhn-js');

export class CardsService {
  private cards: Model<any>;
  constructor(cards: Model<any>) {
    this.cards = cards;
  }

  /**
   * Create book
   * @param params
   */
  protected async createCard (params: CreateCardDTO): Promise<object> {
    try {
      const result = await this.cards.create({
        email: params.email,
        card_number: params.card_number,
        cvv: params.cvv,
        expiration_year: params.expiration_year,
        expiration_month: params.expiration_month,
        token: params.token,
      });
      console.log('>>service>>> ', result);

      return result;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  /**
   * Query card by token
   * @param token
   */
  protected findOneCardByToken (token: string) {
    return this.cards.findOne({ token }).select('card_number email expiration_month expiration_year -_id');
  }

    /**
   * validateToken
   * @param token
   */
     protected validateToken (authorization: string) {
      const token = authorization.split(' ')[1];
      return token.includes('pk_test_');
    }

    /**
   * validateLuhn
   * @param cc
   */
     protected validateLuhn (cc: string) {
      return Luhn.isValid(cc);
    }

    /**
   * validateExpirationYear
   * @param expYear
   */
     protected validateExpirationYear (expYear: number) {
      return expYear <= new Date().getFullYear() + 5;
    }

     /**
   * validateEmail
   * @param email
   */
      protected validateEmail (email: string) {
        const regexEmail = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexEmail.test(email);
      }
}
