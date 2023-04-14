import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import data from 'src/services/data';
import {ObjectId} from 'mongodb'
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

  async findById(id:any){
     id=new ObjectId(id)
    return await this.model.find({"status":1,"_id":id})
    
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
