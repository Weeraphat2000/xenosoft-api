import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from 'src/util/service/authGuard';
import { PrismaService } from 'src/util/prisma.service';

import { HashService } from 'src/util/service/hash.service';
import { JwtService } from 'src/util/service/jwt.service';
import { Request } from 'express';

describe('UserController', () => {
  const mockUsers = [
    {
      id: 'cm1d80di20000l5irkcnkmeqy',
      username: 'john_doe',
      password: 'password',
      isVote: false,
    },
    {
      id: 'cm1bzoa9u00007ayoqbgzdwa3',
      username: 'Hun',
      password: '123',
      isVote: false,
    },
  ];

  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        // UserService,
        PrismaService,
        HashService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'token'),
          },
        },

        {
          provide: UserService,
          useValue: {
            // findAll: jest.fn().mockResolvedValue(mockUsers),
            // findOne: jest.fn((id) => mockUsers.find((user) => user.id === id)),
            // create: jest.fn((user) => ({
            //   id: 3,
            //   username: user.username,
            //   password: user.password,
            //   isVote: false,
            // })),
            // update: jest.fn((id, user) => ({
            //   id,
            //   username: user.username,
            //   password: user.password,
            //   isVote: user.isVote,
            // })),
            remove: jest.fn((id) => mockUsers.filter((user) => user.id !== id)),
            // findMe: jest.fn((id) => {
            //   return mockUsers.find((user) => user.id === id);
            // }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user me', () => {
    // const mockReq = {
    //   headers: {
    //     authorization:
    //       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNtMWQ4MGRpMjAwMDBsNWlya2Nua21lcXkiLCJpYXQiOjE3MjY5OTI5NzUsImV4cCI6MTcyNzQyNDk3NX0._OYZphKxxXPoNk3ECg9GkrMF9ErdnzUUZ2GXb0jsdsA',
    //   },
    // } as Request;
    const mockReq = {
      user: {
        id: 'cm1d80di20000l5irkcnkmeqy', // จำลองค่า user ID
      },
    } as unknown as Request; // แปลง mock object เป็น request

    const users = controller.findMe(mockReq);
    console.log(users, 'users');
    expect(users).toEqual(mockUsers[0]);
  });
});
