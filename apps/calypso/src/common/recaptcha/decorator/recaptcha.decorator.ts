import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { settings } from '../../../settings';

export const Recaptcha = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const recaptchaToken = request.headers['recaptcha-token'];

    if (!recaptchaToken) {
      throw new HttpException(
        { message: 'RECAPTCHA token is missing' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const secretKey = settings.RECAPTCHA_SECRET_KEY;

    const result = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: `secret=${secretKey}&response=${recaptchaToken}`,
      },
    );

    const response = await result.json();

    if (!response.data.success) {
      throw new HttpException(
        { message: 'Invalid RECAPTCHA token' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return response.success;
  },
);
