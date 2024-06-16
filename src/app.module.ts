import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    AuthModule, 
    BookModule, 
    UserModule, 
    PrismaModule],
})
export class AppModule { }
