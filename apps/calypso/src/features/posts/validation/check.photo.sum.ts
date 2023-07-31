import { BadRequestException } from '@nestjs/common';

export const checkPhotoSum = (posts: any[]) => {
  if (posts.length > 10) {
    throw new BadRequestException([
      { message: 'More than 10 photos', field: 'photo' },
    ]);
  }
};
