import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthSerivice } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtAtStrategy, JwtRtStrategy } from "./strategy";

@Module({
    imports:[JwtModule.register({})],
    controllers:[AuthController],
    providers:[AuthSerivice, JwtRtStrategy,JwtAtStrategy]
})
export class AuthModule{}