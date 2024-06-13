import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthSerivice } from "./auth.service";

@Module({
    controllers:[AuthController],
    providers:[AuthSerivice]
})
export class AuthModule{}