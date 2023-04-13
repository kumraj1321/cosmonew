import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await new this.model(createUserDto).save();
  }

  async findAll() {
    //const querySend = showActive ? { langId: langId, status: 1} : { langId: langId};
    return await this.model.find().lean();
  }
  async findUnique(username: string) {
    let user=await this.model.aggregate([
      {$match:{$and:[{username,"status":'1'}]}}
    ])
    if (user.length===0){
      return {
            "message":"Invalid Login Credentials!",
            "status":404,
            "response":[]
          }
    }
    return  {
      "message":"User found ",
      "status":200,
      "response":user[0]
    };
  }
}
