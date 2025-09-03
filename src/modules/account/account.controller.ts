// src/modules/account/account.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account') 
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  getAllAccounts() {
    return this.accountService.getAllAccounts(); 
  }
}

