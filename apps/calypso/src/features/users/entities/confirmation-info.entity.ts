export class ConfirmationInfoEntity {
  userId: string;
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;

  constructor(
    userId: string,
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean,
  ) {
    (this.userId = userId),
      (this.confirmationCode = confirmationCode),
      (this.expirationDate = expirationDate),
      (this.isConfirmed = isConfirmed);
  }
}
