import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostImagesDocument = HydratedDocument<PostImages>;

@Schema()
export class PostImages {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  bucket: string;
  @Prop({ required: true })
  postId: string;
  @Prop({ required: true })
  key: string;
  @Prop({ required: true })
  width: number;
  @Prop({ required: true })
  height: number;
  @Prop({ required: true })
  fileSize: number;
  @Prop({ required: true })
  createdAt: Date;
}

export const PostImagesSchema = SchemaFactory.createForClass(PostImages);
