import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ClientRepository } from '../client/client.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ClientEntity } from '../client/entities/client.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let clientRepository: ClientRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ClientRepository,
          useValue: {
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    clientRepository = moduleRef.get<ClientRepository>(ClientRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const loginDto: LoginDTO = {
        username: 'testuser',
        password: 'testpassword',
      };
      const mockClient = {
        id: '1',
        username: 'testuser',
        password: 'hashedPassword',
        name: 'Test User',
      } as ClientEntity;

      jest
        .spyOn(clientRepository, 'findOneByUsername')
        .mockResolvedValue(mockClient);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);

      const result = await authService.login(loginDto);

      expect(clientRepository.findOneByUsername).toHaveBeenCalledWith(
        'testuser',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'testpassword',
        'hashedPassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: '1',
        username: 'testuser',
        name: 'Test User',
      });
      expect(result).toEqual({ token: 'test_token' });
    });

    it('should throw an UnauthorizedException if username is invalid', async () => {
      const loginDto: LoginDTO = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest.spyOn(clientRepository, 'findOneByUsername').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        'Invalid credentials.',
      );
    });

    it('should throw an UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDTO = {
        username: 'testuser',
        password: 'testpassword',
      };
      const mockClient = {
        id: '1',
        username: 'testuser',
        password: 'hashedPassword',
        name: 'Test User',
      } as ClientEntity;

      jest
        .spyOn(clientRepository, 'findOneByUsername')
        .mockResolvedValue(mockClient);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        'Invalid credentials.',
      );
    });
  });
});
