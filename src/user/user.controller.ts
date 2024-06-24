import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { EditUserDto } from 'src/auth/dto/edit-user.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @UseGuards(JwtGuard)
    @Patch('me')
    updateMe(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto,    
    ) {
        return this.userService.editUser(userId, dto);
    }

}
