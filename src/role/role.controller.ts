import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Public } from 'src/auth/decorators';
import { CreateRoleDto, UpdateRoleDto } from './dtos';
import { RoleService } from './role.service';

@Controller('api/v1/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/')
  getAllRoles() {
    return this.roleService.getRoles();
  }

  @Post('/')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Patch('/:id')
  updateRoleById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRoleById(id, updateRoleDto);
  }
}
