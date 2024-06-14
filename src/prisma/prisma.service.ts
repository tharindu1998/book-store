import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable({})
export class PrismaSerivice extends PrismaClient{
    constructor(){
        super({
            datasources:{
                db:{
                    url:'postgresql://postgres:123@localhost:5434/book-store?schema=public'
                }
            }
        })
    }
}