import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardService } from './credit_card.service';
import { CreditCardRepository } from './credit_card.repository';
import { CreateCreditCardDTO } from './dto/credit_card.dto';
import { CreditCardEntity } from './entities/credit_card.entity';

describe('CreditCardService', () => {
  let creditCardService: CreditCardService;
  let creditCardRepository: CreditCardRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreditCardService,
        {
          provide: CreditCardRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    creditCardService = moduleRef.get<CreditCardService>(CreditCardService);
    creditCardRepository =
      moduleRef.get<CreditCardRepository>(CreditCardRepository);
  });

  describe('create', () => {
    it('should create a credit card with formatted card number', async () => {
      const createCreditCardDto: CreateCreditCardDTO = {
        card_number: '1234567890123456',
        card_holder_name: 'John Doe',
        value: 123,
        exp_date: '12/24',
        cvv: 123,
      };

      const formattedCardNumber = '**** **** **** 3456';
      const expectedCreditCardEntity: CreditCardEntity = {
        id: '1',
        ...createCreditCardDto,
        card_number: formattedCardNumber,
      } as CreditCardEntity;

      jest
        .spyOn(creditCardRepository, 'create')
        .mockResolvedValue(expectedCreditCardEntity);

      const result = await creditCardService.create(createCreditCardDto);

      expect(result).toEqual(expectedCreditCardEntity);
      expect(creditCardRepository.create).toHaveBeenCalledWith({
        ...createCreditCardDto,
        card_number: formattedCardNumber,
      });
      expect(creditCardRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if card number is invalid', async () => {
      const createCreditCardDto: CreateCreditCardDTO = {
        card_number: '1234567',
        card_holder_name: 'John Doe',
        value: 123,
        exp_date: '12/24',
        cvv: 123,
      };

      await expect(
        creditCardService.create(createCreditCardDto),
      ).rejects.toThrow('Invalid card number.');
    });
  });
});
