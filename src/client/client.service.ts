import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ClientRepository } from './client.repository';
import { CreateClientDTO } from './dto/client.dto';
import { ClientEntity } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(client: CreateClientDTO): Promise<void> {
    const hashedPassword = await bcrypt.hash(client.password, 10);
    await this.clientRepository.create({ ...client, password: hashedPassword });
  }

  async findOneById(id: string): Promise<ClientEntity> {
    return await this.clientRepository.findOneById(id);
  }
}
