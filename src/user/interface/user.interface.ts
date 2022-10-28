import { User } from '@prisma/client';
import { CreateAdminUserDto, UpdateAdminDto, UpdateUserDto } from '../dtos';
export interface UserInterface {
  getAllUsers(isAdmin: boolean): Promise<User[]>;
  createAdmins(dto: CreateAdminUserDto): Promise<User>;
  updateAdminsById(id: number, dto: UpdateAdminDto): Promise<User>;
  updateLoggedInUser(id: number, dto: UpdateUserDto): Promise<User>;
  deleteUsers(id: number): Promise<void | { status: string; message: string }>;
}
