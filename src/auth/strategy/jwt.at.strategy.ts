import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../types/jwtPayload.type";

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_AT_SECRET'),
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}