import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DescriptionDto } from '../dto/description.dto';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { CreatePostCommand } from '../application/use-cases/create.post.use.case';
import { UpdateDescriptionForPostCommand } from '../application/use-cases/update.description.for.post.use.case';
import { PostIdDto } from '../dto/post.id.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsEntity } from '../entities/posts.entity';
import { DeletePostCommand } from '../application/use-cases/delete.post.use.case';
import { QueryRepository } from '../../query-repository.ts/query.repository';
import { PostQueryType } from '../../../common/query-types/post.query.type';
import { PostEntityWithImage } from '../../../common/query-types/post.entity.with.image';
import { QueryHelper } from '../../../common/helpers/query.helper';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { checkPhotoSum } from '../validation/check.photo.sum';

@ApiTags('Posts')
@Controller('/posts')
export class PostsController {
  constructor(
    @Inject('FILES_SERVICE') private client: ClientProxy,
    private commandBus: CommandBus,
    private postsRepository: PostsRepository,
    private queryRepository: QueryRepository,
    private queryHelper: QueryHelper,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create post. "fieldName" must be "posts"' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post created',
    type: PostEntityWithImage,
  })
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'List of possible errors:<br>1.Wrong length<br>2.More than 10 photos',
  )
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @Post('post')
  @UseInterceptors(FilesInterceptor('posts'))
  async createPosts(
    @UploadedFiles() posts: Array<Express.Multer.File>,
    @Body() body: DescriptionDto,
    @Req() req,
  ) {
    // const response = await axios.post(
    //   'https://calipso-microservice-files.vercel.app/saveAvatars/saveAvatars',
    //   posts,
    // );
    // console.log(response.data);
    // return response.data;
    checkPhotoSum(posts);
    const pattern = { cmd: 'saveImages' };
    const post: PostsEntity = await this.commandBus.execute(
      new CreatePostCommand(body.description, req.user.id),
    );
    const data = await firstValueFrom(
      this.client.send(pattern, {
        arrayImages: posts,
        postId: post.id,
        userId: post.userId,
      }),
    );
    return { ...post, images: data };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update description for post' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Post updated')
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Wrong length')
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiResponseForSwagger(HttpStatus.FORBIDDEN, 'Forbidden')
  @ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found')
  @Put('post/:postId')
  async updatePost(
    @Body() body: DescriptionDto,
    @Param() param: PostIdDto,
    @Req() req,
  ) {
    await this.commandBus.execute(
      new UpdateDescriptionForPostCommand(
        body.description,
        param.postId,
        req.user.id,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get info for post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostEntityWithImage,
  })
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found')
  @Get('post/:postId')
  async getPost(@Param() param: PostIdDto): Promise<PostEntityWithImage> {
    const pattern = { cmd: 'getImages' };
    const postInfo = await this.postsRepository.getPostById(param.postId);
    const data = await firstValueFrom(this.client.send(pattern, param.postId));
    return { ...postInfo, images: data };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Post deleted')
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiResponseForSwagger(HttpStatus.FORBIDDEN, 'Forbidden')
  @ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found')
  @Delete('post/:postId')
  async deletePost(@Param() param: PostIdDto, @Req() req) {
    await this.commandBus.execute(
      new DeletePostCommand(param.postId, req.user.id),
    );
    const pattern = { cmd: 'deleteImages' };
    await firstValueFrom(this.client.send(pattern, param.postId));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get post for current user' })
  @ApiResponse({ status: HttpStatus.OK, type: PostQueryType })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of elements to return',
    required: false,
    schema: { default: 9, type: 'integer' },
  })
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number to return',
    required: false,
    schema: { default: 1, type: 'integer' },
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    schema: { type: 'string', default: 'desc' },
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'What field to sort by',
    required: false,
    schema: { default: 'createdAt' },
  })
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiResponseForSwagger(HttpStatus.FORBIDDEN, 'Forbidden')
  @Get('/:userId')
  async getPostsCurrentUser(
    @Req() req,
    @Param('userId') userId: string,
    @Query() query,
  ) {
    if (req.user.id !== userId) throw new ForbiddenException();
    const queryParam = this.queryHelper.queryParamHelper(query);
    return this.queryRepository.getPostsAndPhotos(req.user.id, queryParam);
  }
}
