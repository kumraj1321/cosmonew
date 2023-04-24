import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        let result = (await super.canActivate(context)) as boolean
        let request = context.switchToHttp().getRequest()
        await super.logIn(request)
        return result
    }
}