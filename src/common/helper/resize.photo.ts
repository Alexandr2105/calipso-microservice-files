import sharp from 'sharp';

export function resizePhoto(photo): Promise<Buffer> {
  const buffer = Buffer.from(photo);
  return sharp(buffer)
    .resize(300, 180, {
      fit: 'contain',
    })
    .toBuffer();
}
