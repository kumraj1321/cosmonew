import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import data from 'src/services/data';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto){
    await new this.model(createUserDto).save();
    return await this.findAll();
  }

  async findAll() {
    const result:any =  await this.model.find().lean();
    if(result.length > 0){
      result.forEach((element:any, index:number )=> {        
        let userRoles:any = [];
        element['role_id'].forEach((ele:any, ind:number )=> {
          userRoles.push((data.roles.find(item=>item.value === ele)).name);
        });
        result[index]['role_id'] = userRoles;
      });
    }
    return result;
  }
  async readData(email:string, username:any): Promise<User>{
    return await this.model.findOne({ "$or": [{"email": email}, {"username": username}]}).lean();
  }
}
