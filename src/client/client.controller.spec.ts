import { Test } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/client.dto';

describe('ClientController', () => {
  let clientController: ClientController;
  let clientService: ClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: {
            create: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    clientService = moduleRef.get<ClientService>(ClientService);
    clientController = moduleRef.get<ClientController>(ClientController);
  });

  describe('create', () => {
    it('should calls client service', async () => {
      const createClientDto: CreateClientDTO = {} as CreateClientDTO;

      await clientController.create(createClientDto);

      expect(clientService.create).toHaveBeenCalledWith(createClientDto);
      expect(clientService.create).toHaveBeenCalledTimes(1);
    });
  });
});
