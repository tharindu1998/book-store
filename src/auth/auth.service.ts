import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthSerivice{
    
    signup(): string{
        return "I am signed up"
    }

    signin(): string{
        return "I am signed in"
    }
}