import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { createTransport } from 'nodemailer';
import { createApp } from '../src/common/helpers/createApp';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('Create test for auth', () => {
  jest.setTimeout(5 * 60 * 1000);
  let app: INestApplication;
  let test;
  let sendMailMock;
  let code;
  const user = {
    login: 'Alex11',
    password: 'QWERTY',
    email: '5030553@gmail.com',
  };

  beforeAll(async () => {
    sendMailMock = jest.fn();
    (createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app = createApp(app);
    await app.init();
    test = request(app.getHttpServer());
    return test.del('/delete-all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Регистрируем нового пользователя', async () => {
    await test.post('/auth/registration').send(user).expect(204);
    const { html } = sendMailMock.mock.lastCall[0];
    const regex = /code=([a-zA-Z0-9-]+)/;
    code = html.match(regex)[1];
    const info1 = await test
      .post('/auth/registration')
      .send({ login: '', password: '', email: '' })
      .expect(400);
    expect(info1.body).toEqual({
      errorsMessages: [
        { message: 'Wrong length', field: 'login' },
        { message: 'Invalid email', field: 'email' },
        { message: 'Wrong length', field: 'password' },
      ],
    });
    expect(sendMailMock).toHaveBeenCalled();
  });

  it('Подтверждаем регистрацию по коду', async () => {
    await test.get(`/auth/email-confirmation/${code}`).expect(204);
    await test.get('/auth/email-confirmation/:code').expect(400);
  });

  it('login и получения токена', async () => {
    const token = await test
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(token.body).toEqual({
      accessToken: expect.any(String),
      profile: false,
    });
    await test
      .post('/auth/login')
      .send({
        loginOrEmail: 'user.login',
        password: 'user.password',
      })
      .set('user-agent', 'Chrome')
      .expect(401);
    const info = await test
      .get('/auth/me')
      .auth(token.body.accessToken, { type: 'bearer' })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(info.body).toEqual({
      email: user.email,
      login: user.login,
      id: expect.any(String),
    });
    await test
      .get('/auth/me')
      .auth('token.body.accessToken', { type: 'bearer' })
      .set('user-agent', 'Chrome')
      .expect(401);
  });

  it('Запрашиваем новый код по email', async () => {
    await test
      .post('/auth/refresh-link')
      .send({ email: user.email })
      .expect(204);
    const info = await test
      .post('/auth/refresh-link')
      .send({ email: '1234!gmail.com' })
      .expect(400);
    expect(info.body).toEqual({
      errorsMessages: [{ message: 'Invalid email', field: 'email' }],
    });
  });

  it('Делаем запрос на смену пароля', async () => {
    await test
      .post('/auth/password-recovery')
      .send({ email: user.email })
      .expect(204);
    const { html } = sendMailMock.mock.lastCall[0];
    const regex = /code=([a-zA-Z0-9-]+)/;
    code = html.match(regex)[1];
    await test
      .post('/auth/password-recovery')
      .send({ email: 'a!gmail.co' })
      .expect(400);
  });

  it('Устанавливаем новый пароль входим и выходим', async () => {
    await test
      .post('/auth/new-password')
      .send({
        newPassword: 'string',
        recoveryCode: code,
      })
      .expect(204);
    const info = await test
      .post('/auth/new-password')
      .send({
        newPassword: '',
        recoveryCode: '123',
      })
      .expect(400);
    expect(info.body).toEqual({
      errorsMessages: [
        { message: 'Wrong length', field: 'newPassword' },
        { message: 'Incorrect confirmation code', field: 'recoveryCode' },
      ],
    });
    const response = await test
      .post('/auth/login')
      .send({ loginOrEmail: 'Alex11', password: 'string' })
      .set('user-agent', 'Chrome')
      .expect(200);
    await test
      .post('/auth/login')
      .send({ loginOrEmail: 'Alex11', password: 'string1' })
      .set('user-agent', 'Chrome')
      .expect(401);
    const refreshToken = response.headers['set-cookie'];
    await test.post('/auth/logout').set('Cookie', 'asdfadf').expect(401);
    const info2 = await test
      .get('/auth/me')
      .auth(response.body.accessToken, { type: 'bearer' })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(info2.body).toEqual({
      email: user.email,
      login: user.login,
      id: expect.any(String),
    });
    await test.post('/auth/logout').set('Cookie', refreshToken).expect(204);
  });

  it('Получаем новую пару accessToken и refreshToken', async () => {
    const response = await test
      .post('/auth/login')
      .send({ loginOrEmail: 'Alex11', password: 'string' })
      .set('user-agent', 'Chrome')
      .expect(200);
    const refreshToken = response.headers['set-cookie'];
    const response2 = await test
      .post('/auth/refresh-token')
      .set('Cookie', refreshToken)
      .expect(200);
    const refreshToken2 = response2.headers['set-cookie'];
    expect(response2.body.accessToken).not.toEqual(response.body.accessToken);
    expect(refreshToken).not.toEqual(refreshToken2);
  });
});

describe('Create test for profiles', () => {
  jest.setTimeout(5 * 60 * 1000);
  let app: INestApplication;
  let test;
  let sendMailMock;
  let code;
  let token;
  const user = {
    login: 'Alex11',
    password: 'QWERTY',
    email: '5030553@gmail.com',
  };

  beforeAll(async () => {
    sendMailMock = jest.fn();
    (createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app = createApp(app);
    await app.init();
    test = request(app.getHttpServer());
    return test.del('/delete-all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Регистрируем нового пользователя', async () => {
    await test.post('/auth/registration').send(user).expect(204);
    const { html } = sendMailMock.mock.lastCall[0];
    const regex = /code=([a-zA-Z0-9-]+)/;
    code = html.match(regex)[1];
    const info1 = await test
      .post('/auth/registration')
      .send({ login: '', password: '', email: '' })
      .expect(400);
    expect(info1.body).toEqual({
      errorsMessages: [
        { message: 'Wrong length', field: 'login' },
        { message: 'Invalid email', field: 'email' },
        { message: 'Wrong length', field: 'password' },
      ],
    });
    expect(sendMailMock).toHaveBeenCalled();
  });

  it('Подтверждаем регистрацию по коду', async () => {
    await test.get(`/auth/email-confirmation/${code}`).expect(204);
    await test.get('/auth/email-confirmation/:code').expect(400);
  });

  it('login и получения токена', async () => {
    token = await test
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(token.body).toEqual({
      accessToken: expect.any(String),
      profile: false,
    });
  });

  it('Создаем профайл и проверяем его на обновление', async () => {
    await test
      .post('/users/profiles/save-profileInfo')
      .auth(token.body.accessToken, { type: 'bearer' })
      .send({
        login: 'string',
        firstName: 'string',
        lastName: 'string',
        dateOfBirthday: '21-05-1988',
        city: 'string',
        userInfo: 'string',
      })
      .expect(204);
    await test.get('/users/profiles/profile').expect(401);
    await test.post('/users/profiles/save-profileInfo').expect(401);
    const profile = await test
      .get('/users/profiles/profile')
      .auth(token.body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(profile.body).toEqual({
      userId: expect.any(String),
      login: 'string',
      firstName: 'string',
      lastName: 'string',
      dateOfBirthday: '21-05-1988',
      city: 'string',
      userInfo: 'string',
      photo: null,
    });
    await test
      .post('/users/profiles/save-profileInfo')
      .auth(token.body.accessToken, { type: 'bearer' })
      .send({
        login: 'string1',
        firstName: 'string',
        lastName: '',
        dateOfBirthday: '21-05-1988',
        city: 'string',
        userInfo: '',
      })
      .expect(204);
    const profile2 = await test
      .get('/users/profiles/profile')
      .auth(token.body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(profile2.body).toEqual({
      userId: expect.any(String),
      login: 'string1',
      firstName: 'string',
      lastName: '',
      dateOfBirthday: '21-05-1988',
      city: 'string',
      userInfo: '',
      photo: null,
    });
    const profile3 = await test
      .post('/users/profiles/save-profileInfo')
      .auth(token.body.accessToken, { type: 'bearer' })
      .send({
        login: 'str',
        firstName: 'stringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfa',
        lastName: 'stringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfa',
        dateOfBirthday: '21.05.88',
        city: 'stringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfa',
        userInfo:
          'stringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfastringasdfdsa' +
          'fsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfastringasdfdsafsdafsdfsdfsdfdfs' +
          'dfdsfasfdafsdfadfadfafadsfastringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadf' +
          'dfafadsfastringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfass',
      })
      .expect(400);
    expect(profile3.body).toEqual({
      errorsMessages: [
        { message: 'Wrong length', field: 'login' },
        { message: 'Wrong length', field: 'firstName' },
        { message: 'Wrong length', field: 'lastName' },
        {
          message: 'Invalid date format. Please use the format dd-mm-yyyy.',
          field: 'dateOfBirthday',
        },
        { message: 'Wrong length', field: 'city' },
        { message: 'Wrong length', field: 'userInfo' },
      ],
    });
  });

  it('Проверка на возвращение токена и profile = true,', async () => {
    const refreshToken = token.headers['set-cookie'];
    await test.post('/auth/logout').set('Cookie', refreshToken).expect(204);
    token = await test
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(token.body).toEqual({
      accessToken: expect.any(String),
      profile: true,
    });
  });

  it('Проверяем сохранение аватара и его получение', async () => {
    await test.post('/users/profiles/save-avatar').expect(401);
    await test
      .post('/users/profiles/save-avatar')
      .auth(token.body.accessToken, { type: 'bearer' })
      .attach('avatar', 'D:/blogWalpaper.jpg')
      .expect(204);
    const profile = await test
      .get('/users/profiles/profile')
      .auth(token.body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(profile.body).toEqual({
      userId: expect.any(String),
      login: 'Alex11',
      firstName: 'string',
      lastName: '',
      dateOfBirthday: '21-05-1988',
      city: 'string',
      userInfo: '',
      photo: profile.body.photo,
    });
  });
});

describe('Create test for posts', () => {
  jest.setTimeout(5 * 60 * 1000);
  let app: INestApplication;
  let test;
  let sendMailMock;
  let code;
  let code2;
  let token1;
  let token2;
  let post;
  const user = {
    login: 'Alex11',
    password: 'QWERTY',
    email: '5030553@gmail.com',
  };
  const user2 = {
    login: 'Alex22',
    password: 'QWERTY',
    email: '503055@gmail.com',
  };

  beforeAll(async () => {
    sendMailMock = jest.fn();
    (createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app = createApp(app);
    await app.init();
    test = request(app.getHttpServer());
    return test.del('/delete-all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Регистрируем нового пользователя', async () => {
    await test.post('/auth/registration').send(user).expect(204);
    const { html } = sendMailMock.mock.lastCall[0];
    const regex = /code=([a-zA-Z0-9-]+)/;
    code = html.match(regex)[1];
    const info1 = await test
      .post('/auth/registration')
      .send({ login: '', password: '', email: '' })
      .expect(400);
    expect(info1.body).toEqual({
      errorsMessages: [
        { message: 'Wrong length', field: 'login' },
        { message: 'Invalid email', field: 'email' },
        { message: 'Wrong length', field: 'password' },
      ],
    });
    expect(sendMailMock).toHaveBeenCalled();
  });

  it('Регистрируем второго пользователя получаем коды', async () => {
    await test.post('/auth/registration').send(user2).expect(204);
    const { html } = sendMailMock.mock.lastCall[0];
    const regex = /code=([a-zA-Z0-9-]+)/;
    code2 = html.match(regex)[1];
    await test.get(`/auth/email-confirmation/${code2}`).expect(204);
    token2 = await test
      .post('/auth/login')
      .send({
        loginOrEmail: user2.login,
        password: user2.password,
      })
      .set('user-agent', 'Chrome')
      .expect(200);
  });

  it('Подтверждаем регистрацию по коду', async () => {
    await test.get(`/auth/email-confirmation/${code}`).expect(204);
    await test.get('/auth/email-confirmation/:code').expect(400);
  });

  it('login и получения токена', async () => {
    token1 = await test
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(token1.body).toEqual({
      accessToken: expect.any(String),
      profile: false,
    });
    await test
      .post('/auth/login')
      .send({
        loginOrEmail: 'user.login',
        password: 'user.password',
      })
      .set('user-agent', 'Chrome')
      .expect(401);
    const info = await test
      .get('/auth/me')
      .auth(token1.body.accessToken, { type: 'bearer' })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(info.body).toEqual({
      email: user.email,
      login: user.login,
      id: expect.any(String),
    });
    await test
      .get('/auth/me')
      .auth('token.body.accessToken', { type: 'bearer' })
      .set('user-agent', 'Chrome')
      .expect(401);
  });

  it('Создаем пост с фото', async () => {
    await test.post('/posts/post').expect(401);
    post = await test
      .post('/posts/post')
      .auth(token1.body.accessToken, { type: 'bearer' })
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .field({
        description: 'string',
      })
      .expect(201);
    expect(post.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      description: 'string',
      createdAt: expect.any(String),
      images: [
        {
          url: expect.any(String),
        },
        { url: expect.any(String) },
      ],
    });
    const post2 = await test
      .post('/posts/post')
      .auth(token1.body.accessToken, { type: 'bearer' })
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .attach('posts', 'D:/blogWalpaper.jpg')
      .field({
        description: 'adf',
      })
      .expect(400);
    expect(post2.body).toEqual({
      errorsMessages: [{ message: 'More than 10 photos', field: 'photo' }],
    });
    const post3 = await test
      .post('/posts/post')
      .auth(token1.body.accessToken, { type: 'bearer' })
      .attach('posts', 'D:/blogWalpaper.jpg')
      .field({
        description:
          'asdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf' +
          ' adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf' +
          ' adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf' +
          ' adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf ' +
          'adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf ' +
          'adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf a' +
          'df adsfd fdafdsfa fadsfa',
      })
      .expect(400);
    expect(post3.body).toEqual({
      errorsMessages: [{ message: 'Wrong length', field: 'description' }],
    });
  });

  it('Обновляем описание поста и проверяем на правильный вывод', async () => {
    await test
      .put(`/posts/post/${post.body.id}`)
      .send({
        description: 'stringstringstringstring',
      })
      .expect(401);
    await test
      .put(`/posts/post/${post.body.id}`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .send({
        description: 'stringstringstringstring',
      })
      .expect(204);
    const updatePost = await test
      .put(`/posts/post/${post.body.id}`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .send({
        description:
          'asdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf' +
          ' adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf' +
          ' adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf' +
          ' adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf ' +
          'adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf ' +
          'adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf adf adsfd fdafdsfa fadsfaasdfadsfasdfasfdf a' +
          'df adsfd fdafdsfa fadsfa',
      })
      .expect(400);
    expect(updatePost.body).toEqual({
      errorsMessages: [{ message: 'Wrong length', field: 'description' }],
    });
    await test
      .put(`/posts/post/${1234}`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .send({
        description: 'stringstringstringstring',
      })
      .expect(404);
    await test
      .put(`/posts/post/${post.body.id}`)
      .auth(token2.body.accessToken, { type: 'bearer' })
      .send({
        description: 'stringstringstringstring',
      })
      .expect(403);

    const getPost = await test
      .get(`/posts/post/${post.body.id}`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(getPost.body.description).toEqual('stringstringstringstring');
    await test
      .get(`/posts/post/${1234}`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .expect(404);
    await test.get(`/posts/post/${1234}`).expect(401);
  });

  it('Получаем пост конкретного пользователя', async () => {
    await test.get(`/posts/${post.body.userId}`).expect(401);
    await test
      .get(`/posts/${post.body.userId}`)
      .auth(token2.body.accessToken, { type: 'bearer' })
      .expect(403);
    const postInfo = await test
      .get(`/posts/${post.body.userId}`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .expect(200);
    console.log(postInfo.body);
    //TODO:додеталь вывод query post и сделать тест на удаление
  });
});
