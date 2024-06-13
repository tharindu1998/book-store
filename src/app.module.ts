import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, BookModule, UserModule],
})
export class AppModule {}
