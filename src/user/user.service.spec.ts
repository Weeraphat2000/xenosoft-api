import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/util/prisma.service';

describe('UserService', () => {
  const mockUsers = [
    {
      id: '1',
      username: 'test',
      password: 'test',
      isVote: false,
    },
    {
      id: '2',
      username: 'test2',
      password: 'test2',
      isVote: false,
    },
  ];
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            // Mock ฟังก์ชันของ PrismaService ที่จะถูกใช้ใน UserService
            user: {
              findMany: jest.fn().mockResolvedValue(mockUsers), // Mock การค้นหาผู้ใช้งานทั้งหมด
              findUnique: jest.fn((args) =>
                mockUsers.find((user) => user.id === args.where.id),
              ), // Mock การค้นหาผู้ใช้งานตาม ID
              create: jest.fn().mockImplementation((userData) => ({
                id: '3',
                username: userData.data.username,
              })), // Mock การสร้างผู้ใช้งานใหม่
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const users = await service.findAll();
    console.log(users, 'users');
    expect(users).toEqual([
      {
        id: '1',
        username: 'test',
        isVote: false,
      },
      {
        id: '2',
        username: 'test2',
        isVote: false,
      },
    ]);
  });

  // it('should return user by id', () => {
  //   expect(service.findUesrById('1')).toEqual(user[0]);
  // });

  // it('should return user by username', () => {
  //   expect(service.findUserByUsername('test')).toEqual(user[0]);
  // });

  // it('should create user', () => {
  //   const newUser = {
  //     username: 'test3',
  //     password: 'test3',
  //     confirmPassword: 'test3',
  //   };
  //   expect(service.create(newUser)).toEqual({
  //     id: '3',
  //     username: 'test3',
  //   });
  // });
});
