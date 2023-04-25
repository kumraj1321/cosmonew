import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor (private userService: UserService) { }
    async validateUser(username: any, password: any) {
        let user = this.userService.findUnique(username, password)
        if (user) {
            return user
        }
        return null
    }
}
