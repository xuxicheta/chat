import * as request from 'supertest';
import * as assert from 'assert';
import { Server } from 'http';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { DatabaseModule } from '../src/common/modules/database/database.module';
import { UserService } from '../src/api/user/user.service';
import { AppModule } from '../src/app.module';
import { IUser } from '../src/common/schemas/user.schema';

describe('USERS_MODULE AUTH_MODULE', () => {
  let app: INestApplication;
  let server: Server;
  let bearer: string;
  let userId: string;
  const username = 'username';
  const password = 'password';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AppModule,
      ],
    })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = app.getHttpServer();

    await app.get(UserService).getUserModel().deleteMany({});
  });

  it('GET api/auth', () => {
    return request(server)
      .get('/api/auth')
      .expect('auth');
  });

  it('/POST api/users', () => {
    return request(server)
      .post('/api/users')
      .send({ username: 'username', password: 'password' })
      .expect('OK');
  });

  it(`/GET api/users not logged`, () => {
    return request(server)
      .get('/api/users')
      .expect(401);
  });

  it(`/GET api/users/:id not logged`, () => {
    return request(server)
      .get(`/api/users/${userId}`)
      .expect(401);
  });

  it(`/DELETE api/users/:id not logged`, () => {
    return request(server)
      .delete(`/api/users/${userId}`)
      .expect(401);
  });

  it('/POST api/auth/login', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username, password })
      .expect(200)
      .then((res) => {
        assert.ok(res.body.bearer);
        assert.ok(res.body.userId);
        bearer = res.body.bearer;
        userId = res.body.userId;
      });
  });

  it(`/GET api/users`, () => {
    return request(server)
      .get('/api/users')
      .auth(bearer, { type: 'bearer' })
      .expect(200)
      .then(res => {
        assert.ok(Array.isArray(res.body));
        assert.equal(res.body[0]._id, userId);
      });
  });

  it(`/GET api/users/:id`, () => {
    return request(server)
      .get(`/api/users/${userId}`)
      .auth(bearer, { type: 'bearer' })
      .expect(200)
      .then(res => {
        const user: IUser = res.body;
        assert.equal(user._id, userId);
        assert.equal(user.username, username);
        const lastLoginAt = new Date(user.lastLoginAt).getTime();
        assert.ok(lastLoginAt < Date.now());
        assert.ok(lastLoginAt > Date.now() - 500);
        const createdAt = new Date(user.createdAt).getTime();
        assert.ok(createdAt < Date.now());
        assert.ok(createdAt > Date.now() - 500);
        const updatedAt = new Date(user.createdAt).getTime();
        assert.ok(updatedAt < Date.now());
        assert.ok(updatedAt > Date.now() - 500);
      });
  });

  it(`/DELETE api/users/:id`, () => {
    return request(server)
      .delete(`/api/users/${userId}`)
      .auth(bearer, { type: 'bearer' })
      .expect(200)
      .expect('OK');
  });

  it('/POST api/auth/logout', () => {
    return request(server)
      .post('/api/auth/logout')
      .auth(bearer, { type: 'bearer' })
      .expect(401);
  });

  it('/POST api/users - create user again', () => {
    return request(server)
      .post('/api/users')
      .send({ username: 'username', password: 'password' })
      .expect(201);
  });

  it('/POST api/auth/login - login again', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username, password })
      .then((res) => {
        bearer = res.body.bearer;
        userId = res.body.userId;
      });
  });

  it('/POST api/auth/logout', () => {
    return request(server)
      .post('/api/auth/logout')
      .auth(bearer, { type: 'bearer' })
      .expect(200)
      .expect('OK');
  });

  it('/POST api/auth/login - incorrect username', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username: '4464', password })
      .expect(400);
  });

  it('/POST api/auth/login - empty username', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username: '', password })
      .expect(400);
  });

  it('/POST api/auth/login - incorrect password', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username, password: '453' })
      .expect(400);
  });

  it('/POST api/auth/login - empty password', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username, password: '' })
      .expect(400);
  });

  it('/POST api/auth/login - wrong password', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username, password: '342Soda' })
      .expect(404);
  });

  it('/POST api/auth/login - not existed username', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username: 'Gather3434', password })
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
