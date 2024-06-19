import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaSerivice } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthSerivice {

    constructor(
        private prismaService: PrismaSerivice,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async signup(dto: AuthDto) {
        const argon2 = require('argon2');
        try {
            const hash = await argon2.hash(dto.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email as string,
                    hash: hash,
                },
            });
            return this.signToken(user.id, user.email);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials Already Taken'
                    )
                }
            } else {
                throw error;
            }
        }
    }

    async signin(dto: AuthDto) {
        const argon2 = require('argon2');
        //check user
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email as string,
            },
        })

        if (!user) {
            throw new ForbiddenException(
                'Credentials are incorrect'
            );
        }
        //check password
        const pwMatches = await argon2.verify(user.hash, dto.password);

        if (!pwMatches) {
            throw new ForbiddenException(
                'Password is incorrect'
            );
        }
        return this.signToken(user.id, user.email);
    }

    logout() {
        throw new Error("Method not implemented.");
    }
    refreshTokens() {
        throw new Error("Method not implemented.");
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payLoad = {
            sub: userId,
            email,
        };
        const secret = this.configService.get<string>('JWT_SECRET');

        const token = await this.jwtService.signAsync(payLoad, {
            expiresIn: '15min',
            secret: secret,
        });

        return {
            access_token: token,
        };
    }
}
