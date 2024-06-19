import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtPayload } from "../types/jwtPayload.type";
import { Request } from "express";
import { JwtPayloadWithRt } from "../types/jwtPayloadWithRt.type";


@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_RT_SECRET'),
            passReqToCallback: true,
        });
    }
    validate(req: Request, payload: JwtPayload):JwtPayloadWithRt {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();

        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

        return {
            ...payload,
            refreshToken
        };
    }
}