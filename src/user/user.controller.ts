import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Delete,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { GetUser } from 'src/auth/decorators';
import { CreateAdminUserDto, UpdateAdminDto, UpdateUserDto } from './dtos';
import { UserService } from './user.service';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  getAllUsers(@Query('isAdmin', ParseBoolPipe) isAdmin: boolean) {
    return this.userService.getAllUsers(isAdmin);
  }

  @Post('/admins')
  createAdminUser(@Body() dto: CreateAdminUserDto) {
    return this.userService.createAdmins(dto);
  }

  @Patch('/loggedin/details')
  updateLoggedInUserDetails(
    @GetUser('id') id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateLoggedInUser(id, dto);
  }

  @Patch('/admins/:id')
  updateAdminsById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminDto,
  ) {
    return this.userService.updateAdminsById(id, dto);
  }

  @Delete('/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUsers(id);
  }
}
