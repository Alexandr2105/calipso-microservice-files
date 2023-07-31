import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiResponseForSwagger(status: number, description: string) {
  let response;
  if (status === HttpStatus.BAD_REQUEST) {
    response = ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          errorsMessages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                field: { type: 'string' },
              },
            },
          },
        },
      },
    });
  }

  if (
    status === HttpStatus.OK ||
    status === HttpStatus.NO_CONTENT ||
    status === HttpStatus.UNAUTHORIZED ||
    status === HttpStatus.FORBIDDEN ||
    status === HttpStatus.NOT_FOUND
  ) {
    response = ApiResponse({
      status,
      description,
    });
  }

  return response;
}
