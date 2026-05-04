import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Roles(Role.admin)
  findAll(@Query() query: UsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('patients')
  @Roles(Role.admin, Role.doctor)
  findPatients(@Query() query: PaginationDto) {
    return this.usersService.findAllPatients(query.page, query.limit, query.order);
  }

  @Get('doctors')
  @Roles(Role.admin)
  findDoctors(@Query() query: PaginationDto) {
    return this.usersService.findAllDoctors(query.page, query.limit, query.order);
  }
}
