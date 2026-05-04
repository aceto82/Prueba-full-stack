import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('doctors')
  async getDoctors(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('specialty') specialty?: string,
  ) {
    return this.usersService.findDoctors(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      specialty,
    );
  }

  @Get('patients')
  async getPatients(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findPatients(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get('users')
  async getUsers(
    @Query('role') role: 'doctor' | 'patient',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findByRole(
      role,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }
}