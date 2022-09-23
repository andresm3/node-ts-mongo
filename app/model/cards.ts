import mongoose from 'mongoose';

export type CardsDocument = mongoose.Document & {
  token?: string,
  email: string,
  card_number: string,
  cvv?: number,
  expiration_year: string,
  expiration_month: string,
};

const cardsSchema = new mongoose.Schema({
  // id: { type: Number, index: true, unique: true },
  token: String,
  email: String,
  card_number: String,
  cvv: Number,
  expiration_year: String,
  expiration_month: String,
  createdAt: { type: Date, default: Date.now },
});

// Note: OverwriteModelError: Cannot overwrite `Cards` model once compiled. error
export const cards = (mongoose.models.cards ||
mongoose.model<CardsDocument>('cards', cardsSchema, process.env.DB_CARDS_COLLECTION)
);
