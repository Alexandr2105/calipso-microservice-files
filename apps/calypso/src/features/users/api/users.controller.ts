import { Controller } from '@nestjs/common';

// @ApiTags('Users')
@Controller('users')
export class UsersController {
  // @ApiOperation({ summary: 'Get all users' })
  // @ApiResponseForSwagger(HttpStatus.OK, 'All users')
  // @Get()
  // async getAllUsers() {
  //   return this.userRepo.getAllUsers();
  // }
}
