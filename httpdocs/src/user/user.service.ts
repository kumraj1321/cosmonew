import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    return await this.model.find().exec();
  }
}
