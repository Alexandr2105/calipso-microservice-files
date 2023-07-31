import { ApiProperty } from '@nestjs/swagger';

export class UsersProfilesEntity {
  @ApiProperty({ type: 'string', description: 'User id' })
  userId: string;
  @ApiProperty({ type: 'string', description: 'User login' })
  login: string;
  @ApiProperty({ type: 'string', description: 'User first name' })
  firstName?: string;
  @ApiProperty({ type: 'string', description: 'User last name' })
  lastName?: string;
  @ApiProperty({ type: 'string', description: 'User date of birthday' })
  dateOfBirthday?: string;
  @ApiProperty({ type: 'string', description: 'User city' })
  city?: string;
  @ApiProperty({ type: 'string', description: 'User info' })
  userInfo?: string;
  @ApiProperty({ type: 'string', description: 'User avatar' })
  photo?: string;

  constructor(
    userId: string,
    login: string,
    firstName: string,
    lastName: string,
    dateOfBirthday: string,
    city: string,
    userInfo: string,
    photo: string,
  ) {
    (this.userId = userId),
      (this.login = login),
      (this.firstName = firstName),
      (this.lastName = lastName),
      (this.dateOfBirthday = dateOfBirthday),
      (this.city = city),
      (this.userInfo = userInfo),
      (this.photo = photo);
  }
}
