import { Global, Module } from '@nestjs/common';
import { PrismaSerivice } from './prisma.service';

@Global()
@Module({
    providers:[PrismaSerivice],
    exports:[PrismaSerivice]
})
export class PrismaModule {

}
