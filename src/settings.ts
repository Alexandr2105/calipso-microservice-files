import { config } from 'dotenv';
import * as process from 'process';
config();

export const settings = {
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  S3_REGION: process.env.S3_REGION,
  BASE_URL_AWS: process.env.BASE_URL_AWS,
  BACKET_NAME: process.env.BACKET_NAME,
  // MONGO_DB: process.env.MONGO_DB,
};
