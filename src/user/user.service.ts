import { Injectable } from '@nestjs/common';
import { EditUserDto } from 'src/auth/dto/edit-user.dto';
import { PrismaSerivice } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaSerivice) {}

    async editUser(
        userId: number,
        dto: EditUserDto,
      ) {
        const user = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            ...dto,
          },
        });
    
        delete user.hash;
    
        return user;
      }
}
