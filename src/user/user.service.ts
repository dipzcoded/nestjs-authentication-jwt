import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminUserDto, UpdateAdminDto, UpdateUserDto } from './dtos';
import { UserInterface } from './interface';

@Injectable()
export class UserService implements UserInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers(isAdmin: boolean): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        isSuperAdmin: false,
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
    if (!isAdmin) {
      return users.filter((e) =>
        e.roles.find((rol) => rol.role.name.includes('User')),
      );
    } else {
      return users.filter((e) =>
        e.roles.find((rol) => rol.role.name.includes('Admin')),
      );
    }
  }
  async createAdmins(dto: CreateAdminUserDto): Promise<User> {
    const body = dto;
    const userFound = await this.prismaService.user.findMany({
      where: {
        OR: [{ email: body.email }, { userName: body.userName }],
      },
    });
    if (userFound.length) {
      throw new ForbiddenException(
        'admin already exist with the provided details',
      );
    }

    const adminRole = await this.prismaService.role.findUnique({
      where: { name: 'Admin' },
    });

    if (!adminRole) {
      throw new ForbiddenException(
        'No Admin role in the database...kindly create one before you can create admin user',
      );
    } else {
      // encryt user password
      const hashPassword = await argon2.hash(body.password);

      // save user to database
      const newAdminUser = await this.prismaService.user.create({
        data: {
          name: body.name,
          userName: body.userName,
          email: body.email,
          password: hashPassword,
          roles: {
            create: {
              roleId: adminRole.id,
            },
          },
        },

        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      return newAdminUser;
    }
  }
  async updateAdminsById(id: number, dto: UpdateAdminDto): Promise<User> {
    const adminUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!adminUser) {
      throw new ForbiddenException('admin user not found...invalid id');
    }

    const updatedAdminUser = await this.prismaService.user.update({
      where: {
        id: adminUser.id,
      },
      data: {
        ...dto,
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
    return updatedAdminUser;
  }

  async updateLoggedInUser(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ForbiddenException('user not found');
    }

    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteUsers(id: number): Promise<void> {
    const adminUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!adminUser) {
      throw new NotFoundException('admin user not found');
    }

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
