import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ClientRepository } from 'src/client/client.repository';
import { LoginDTO, AccessToken } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(login: LoginDTO): Promise<AccessToken> {
    const client = await this.clientRepository.findOneByUsername(
      login.username,
    );
    if (!client) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatching = await bcrypt.compare(
      login.password,
      client.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const payload = {
      id: client.id,
      username: client.username,
      name: client.name,
    };

    const token = this.jwtService.sign(payload);

    return { token };
  }
}
