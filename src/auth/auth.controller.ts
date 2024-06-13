import { Controller, Post } from "@nestjs/common";
import { AuthSerivice } from "./auth.service";


@Controller('auth')
export class AuthController{
    constructor(private authService:AuthSerivice){}

    @Post('signup')
    signup(){
        return this.authService.signup();
    }

    @Post('signin')
    signin(){
        return this.authService.signin();
    }
}
