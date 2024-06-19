import { Test } from '@nestjs/testing';
import { ClientRepository } from './client.repository';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { CreateClientDTO } from './dto/client.dto';

describe('ClientRepository', () => {
  let clientRepository: ClientRepository;
  let clientModel: Repository<ClientEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ClientRepository,
        {
          provide: getRepositoryToken(ClientEntity),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    clientRepository = moduleRef.get<ClientRepository>(ClientRepository);
    clientModel = moduleRef.get<Repository<ClientEntity>>(
      getRepositoryToken(ClientEntity),
    );
  });

  describe('create', () => {
    it('should save a client', async () => {
      const createClientDto: CreateClientDTO = {
        username: 'testuser',
        password: 'testpassword',
      } as CreateClientDTO;

      await clientRepository.create(createClientDto);

      expect(clientModel.save).toHaveBeenCalledWith(createClientDto);
      expect(clientModel.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByClientname', () => {
    it('should find a client by username', async () => {
      const username = 'testuser';
      const mockClientEntity = {} as ClientEntity;

      jest.spyOn(clientModel, 'findOneBy').mockResolvedValue(mockClientEntity);

      const result = await clientRepository.findOneByUsername(username);

      expect(clientModel.findOneBy).toHaveBeenCalledWith({ username });
      expect(result).toBe(mockClientEntity);
      expect(clientModel.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should find a client by id', async () => {
      const clientId = '123';
      const mockClientEntity = {} as ClientEntity;

      jest.spyOn(clientModel, 'findOneBy').mockResolvedValue(mockClientEntity);

      const result = await clientRepository.findOneById(clientId);

      expect(clientModel.findOneBy).toHaveBeenCalledWith({ id: clientId });
      expect(result).toBe(mockClientEntity);
      expect(clientModel.findOneBy).toHaveBeenCalledTimes(1);
    });
  });
});
