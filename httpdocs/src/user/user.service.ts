import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto){
    await new this.model(createUserDto).save();
    return await this.findAll();
  }

  async findAll() {
    //const querySend = showActive ? { langId: langId, status: 1} : { langId: langId};
    return await this.model.find().lean();
  }
  async readData(email:string, username:any): Promise<User>{
    return await this.model.findOne({ "$or": [{"email": email}, {"username": username}]}).lean();
  }
}
