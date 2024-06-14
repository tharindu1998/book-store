import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaSerivice } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { argon2d } from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthSerivice{
    constructor(private prismaService :PrismaSerivice){
    }

    async signup(dto: AuthDto) {
        const argon2 = require('argon2');
        try{
            const hash = await argon2.hash(dto.password);  
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash: hash,  
                },
            });
            delete user.hash;
            return user;
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Credentials Already Taken'
                    )
                }
            }else{
                throw error;
            }
        }
    }

    signin(){
        return {msg: "I am signed in"};
    }
}