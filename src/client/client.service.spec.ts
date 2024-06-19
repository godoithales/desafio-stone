import { Test } from '@nestjs/testing';
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/client.dto';
import { ClientRepository } from './client.repository';
import * as bcrypt from 'bcrypt';
import { ClientEntity } from './entities/client.entity';

describe('ClientService', () => {
  let clientService: ClientService;
  let clientRepository: ClientRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: ClientRepository,
          useValue: {
            create: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    clientService = moduleRef.get<ClientService>(ClientService);
    clientRepository = moduleRef.get<ClientRepository>(ClientRepository);
  });

  describe('create', () => {
    it('should create a client with hashed password', async () => {
      const createClientDto: CreateClientDTO = {
        username: 'testuser',
        password: 'testpassword',
      } as CreateClientDTO;
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');

      await clientService.create(createClientDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 10);
      expect(clientRepository.create).toHaveBeenCalledWith({
        ...createClientDto,
        password: 'hashedPassword',
      });
      expect(clientRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should find a client by id', async () => {
      const clientId = '123';
      const mockClientEntity = {} as ClientEntity;
      jest
        .spyOn(clientRepository, 'findOneById')
        .mockResolvedValue(mockClientEntity);

      const result = await clientService.findOneById(clientId);

      expect(clientRepository.findOneById).toHaveBeenCalledWith(clientId);
      expect(result).toBe(mockClientEntity);
      expect(clientRepository.findOneById).toHaveBeenCalledTimes(1);
    });
  });
});
