import { Injectable } from "@nestjs/common";
import { PrismaSerivice } from "src/prisma/prisma.service";

@Injectable({})
export class AuthSerivice{
    constructor(private prismaService :PrismaSerivice){

    }
    
    signup(){
        return {msg: "I am signed up"};
    }

    signin(){
        return {msg: "I am signed in"};
    }
}