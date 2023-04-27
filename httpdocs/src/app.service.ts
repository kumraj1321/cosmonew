import { Injectable } from '@nestjs/common';
import { Render } from '@nestjs/common/decorators';
import { count } from 'console';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(private readonly userservice: UserService) { }
  getHello(): string {
    return 'Hello World!';
  }

  async findCount() {
    let resp = await this.userservice.findCount()
    return resp;
  }
}
