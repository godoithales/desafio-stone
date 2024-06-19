import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditCardRepository } from './credit_card.repository';
import { CreditCardEntity } from './entities/credit_card.entity';
import { CreateCreditCardDTO } from './dto/credit_card.dto';

describe('CreditCardRepository', () => {
  let creditCardRepository: CreditCardRepository;
  let repository: Repository<CreditCardEntity>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreditCardRepository,
        {
          provide: getRepositoryToken(CreditCardEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    creditCardRepository =
      moduleRef.get<CreditCardRepository>(CreditCardRepository);
    repository = moduleRef.get<Repository<CreditCardEntity>>(
      getRepositoryToken(CreditCardEntity),
    );
  });

  describe('create', () => {
    it('should save a new credit card entity', async () => {
      const createCreditCardDto: CreateCreditCardDTO = {
        card_number: '**** **** **** 3456',
        card_holder_name: 'John Doe',
        value: 123,
        exp_date: '12/24',
        cvv: 123,
      };

      const creditCardEntity = new CreditCardEntity();
      Object.assign(creditCardEntity, createCreditCardDto);

      jest.spyOn(repository, 'save').mockResolvedValue(creditCardEntity);

      const result = await creditCardRepository.create(createCreditCardDto);

      expect(result).toEqual(creditCardEntity);
      expect(repository.save).toHaveBeenCalledWith(createCreditCardDto);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });
});
