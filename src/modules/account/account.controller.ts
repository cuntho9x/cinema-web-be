import { Body, Controller, Post, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { User } from './user.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async register(@Body() body: Partial<User>) {
    return this.accountService.createUser(body);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }
}
