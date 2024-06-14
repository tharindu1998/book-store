import { Body, Controller, Post } from "@nestjs/common";
import { AuthSerivice } from "./auth.service";
import { AuthDto } from "./dto";


@Controller('auth')
export class AuthController{
    constructor(private authService:AuthSerivice){}

    @Post('signup')
    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthDto){
        return this.authService.signin(dto);
    }
}
