import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvatarDocument } from '../schemas/avatar.schema';

@Injectable()
export class AvatarsRepository {
  constructor(@InjectModel('avatar') private avatar: Model<AvatarDocument>) {}

  async saveAvatar(avatar: AvatarDocument) {
    const modifiedAvatar = avatar.toObject();
    delete modifiedAvatar._id;
    await this.avatar.findOneAndUpdate(
      { userId: avatar.userId },
      modifiedAvatar,
      {
        new: true,
        upsert: true,
      },
    );
  }

  async getAvatarInfo(userId: string): Promise<AvatarDocument> {
    return this.avatar.findOne({ userId: userId });
  }
}
