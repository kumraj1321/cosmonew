import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport/dist';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
@Module({
  imports:[UserModule,PassportModule.register({session:true})],
  providers: [AuthService,LocalStrategy,SessionSerializer]
})
export class AuthModule {}
