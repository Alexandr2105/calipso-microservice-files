export class RefreshTokenDataEntity {
  iat: number;
  exp: number;
  deviceId: string;
  ip: string;
  deviceName: string;
  userId: string;

  constructor(
    iat: number,
    exp: number,
    deviceId: string,
    ip: string,
    deviceName: string,
    userId: string,
  ) {
    this.exp = exp;
    this.iat = iat;
    this.userId = userId;
    this.ip = ip;
    this.deviceName = deviceName;
    this.deviceId = deviceId;
  }
}
