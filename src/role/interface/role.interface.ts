import { Role } from '@prisma/client';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';

export interface RoleInterface {
  getRoles(): Promise<Role[]>;
  createRole(createRoleDto: CreateRoleDto): Promise<Role>;
  updateRoleById(id: number, updateRoleDto: UpdateRoleDto): Promise<Role>;
}
