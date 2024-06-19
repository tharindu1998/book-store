import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaSerivice } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Tokens } from "./types";

@Injectable({})
export class AuthSerivice {

    constructor(
        private prismaService: PrismaSerivice,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async signup(dto: AuthDto): Promise<Tokens> {
        const argon2 = require('argon2');
        try {
            const hash = await argon2.hash(dto.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email as string,
                    hash: hash,
                },
            });

            const tokens = await this.signToken(user.id, user.email);
            await this.updateRtHash(user.id, tokens.refresh_token)
            return tokens;

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
        if (!pwMatches) throw new ForbiddenException('Access Denied');

        if (!pwMatches) {
            throw new ForbiddenException(
                'Password is incorrect'
            );
        }
        const tokens = await this.signToken(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token)
        return tokens;
    }

    async logout(userId:number) {
        await this.prismaService.user.updateMany({
            where: {
                id: userId,
                hashedRt:{
                    not: null
                }
            },
            data: {
                hashedRt: null
            }
        })
    }
    
    async refreshTokens(userId: number, rt: string) {
        const argon2 = require('argon2');
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) throw new ForbiddenException('Access Denied');

        const rtMatches = await argon2.verify(user.hashedRt, rt);

        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.signToken(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async signToken(userId: number, email: string): Promise<Tokens> {
        const payLoad = {
            sub: userId,
            email,
        };
        const at_secret = this.configService.get<string>('JWT_AT_SECRET');
        const rt_secret = this.configService.get<string>('JWT_RT_SECRET');

        const at_token = await this.jwtService.signAsync(payLoad, {
            expiresIn: '15min',
            secret: at_secret,
        });

        const rt_token = await this.jwtService.signAsync(payLoad, {
            expiresIn: '7d',
            secret: rt_secret,
        });

        return {
            access_token: at_token,
            refresh_token: rt_token
        };
    }

    async updateRtHash(userId: number, rt: string) {
        const argon2 = require('argon2');
        const hash = await argon2.hash(rt);

        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash
            }
        })
    }
}
