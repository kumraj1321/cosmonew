import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserSchema } from "src/schemas/user";
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from "./users.service";

@Module({
  imports:[MongooseModule.forFeature([{name:'User', schema:UserSchema}])],
  controllers: [UsersController],
  providers: [UsersService],
 // exports: [UsersService],
})
export class UsersModule { }
