import { config } from 'dotenv';
import * as process from 'process';
config();

export const settings = {
  SWAGGER: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || '1234',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '12345',
  TOKEN_LIFE: 3000,
  REFRESH_TOKEN_LIFE: 6000,
  CURRENT_APP_BASE_URL:
    process.env.CURRENT_APP_BASE_URL || 'http://localhost:3000',
  RECOVERY_PASSWORD: process.env.ADDRESS_SITE_FOR_RECOVERY_PASSWORD,
  ADDRESS_SITE_FOR_CONFIRMATION:
    process.env.ADDRESS_SITE_FOR_CONFIRMATION || 'http://localhost:3000',
  // ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  // SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  // S3_REGION: process.env.S3_REGION,
  // BASE_URL_AWS: process.env.BASE_URL_AWS,
  // BACKET_NAME: process.env.BACKET_NAME,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  RECAPTCHA_SITE_KEY: '6Le96RMnAAAAAE9dOL6eVQHJ1HYsNAo4OUbDGWIg',
};
