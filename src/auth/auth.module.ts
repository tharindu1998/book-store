import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthSerivice } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
    imports:[JwtModule.register({})],
    controllers:[AuthController],
    providers:[AuthSerivice, JwtStrategy]
})
export class AuthModule{}