import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable({})
export class PrismaSerivice extends PrismaClient{
    constructor(config:ConfigService){
        super({
            datasources:{
                db:{
                    url: config.get('DATABASE_URL')
                }
            }
        })
    }

    async onModuleInit(){
        await this.$connect();
    }

    async onModuleDestroy(){
        await this.$disconnect();
    }
}