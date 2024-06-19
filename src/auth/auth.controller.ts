import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO, AccessToken } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  async login(@Body() login: LoginDTO): Promise<AccessToken> {
    return await this.authService.login(login);
  }
}
