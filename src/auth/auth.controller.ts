import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthSerivice } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { GetCurrentUser } from "./decorator/get-current-user.decorator";
import { GetCurrentUserId } from "./decorator/get-current-user-id.decorator";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthSerivice) { }

    @Post('/local/signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signup(dto);
    }

    @Post('/local/signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req: Request) {
        const user = req.user;
        return this.authService.refreshTokens(user['id'],user['refreshToken']);
    }
}
