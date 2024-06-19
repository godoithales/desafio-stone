import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/client.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() client: CreateClientDTO): Promise<void> {
    await this.clientService.create(client);
  }
}
