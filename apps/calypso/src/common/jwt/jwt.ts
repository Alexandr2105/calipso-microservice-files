import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { settings } from '../../settings';

@Injectable()
export class Jwt {
  constructor(private jwt: JwtService, private refreshToken: JwtService) {}

  creatJWT(id: string) {
    return {
      accessToken: this.jwt.sign(
        { userId: id },
        { expiresIn: settings.TOKEN_LIFE, secret: settings.JWT_SECRET },
      ),
    };
  }

  creatRefreshJWT(userId: string, deviceId: string) {
    return this.refreshToken.sign(
      {
        userId: userId,
        deviceId: deviceId,
      },
      {
        expiresIn: settings.REFRESH_TOKEN_LIFE,
        secret: settings.REFRESH_TOKEN_SECRET,
      },
    );
  }

  getUserIdByToken(token: string) {
    try {
      const result: any = this.jwt.verify(token, {
        secret: settings.JWT_SECRET,
      });
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  getUserByRefreshToken(token: string) {
    try {
      const result = this.jwt.verify(token, {
        secret: settings.REFRESH_TOKEN_SECRET,
      });
      return new Object(result);
    } catch (error) {
      return null;
    }
  }
}
