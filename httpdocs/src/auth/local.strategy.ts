
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (private authService: AuthService) {
        super()
    }
    async validate(username: string, password: string) {
        let user = await this.authService.validateUser(username, password)

        if (!user) {
            return {
                "Error": "Invalid Login Credentials!"
            }
            // return null
        }
        return user
    }

}