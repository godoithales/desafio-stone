import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDTO } from './dto/client.dto';
import { ClientEntity } from './entities/client.entity';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private clientModel: Repository<ClientEntity>,
  ) {}

  async create(Client: CreateClientDTO): Promise<void> {
    await this.clientModel.save(Client);
  }

  async findOneByUsername(username: string): Promise<ClientEntity> {
    return await this.clientModel.findOneBy({ username });
  }

  async findOneById(id: string): Promise<ClientEntity> {
    return await this.clientModel.findOneBy({ id });
  }
}
