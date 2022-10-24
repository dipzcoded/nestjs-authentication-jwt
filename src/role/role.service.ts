import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dtos';
import { RoleInterface } from './interface';

@Injectable()
export class RoleService implements RoleInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async getRoles(): Promise<Role[]> {
    const allRoles = await this.prismaService.role.findMany({});
    return allRoles;
  }
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = await this.prismaService.role.create({
      data: {
        name: createRoleDto.name,
      },
    });

    return newRole;
  }
  async updateRoleById(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const role = await this.prismaService.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException(`role not found by id ${id}`);
    }

    return this.prismaService.role.update({
      where: {
        id: role.id,
      },
      data: {
        name: updateRoleDto.name,
      },
    });
  }
}
