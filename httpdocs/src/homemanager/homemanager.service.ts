import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateHomemanagerDto } from './dto/create-homemanager.dto';
// import { UpdateHomemanagerDto } from './dto/update-Homemanager.dto';
import { Homemanager, HomemanagerDocument } from './entities/homemanager.entity';
import { Model } from 'mongoose';
import data from 'src/services/data';
import { ObjectId } from 'mongodb'
@Injectable()
export class HomemanagerService {
  constructor(@InjectModel(Homemanager.name) private readonly model: Model<HomemanagerDocument>) { }

  async create(createHomemanagerDto: CreateHomemanagerDto) {
    await new this.model(createHomemanagerDto).save();
    return await this.findAll();
  }

  async findAll() {
    const result: any = await this.model.find().lean();
    if (result.length > 0) {
      result.forEach((element: any, index: number) => {
        let HomemanagerRoles: any = [];
        element['role_id'].forEach((ele: any, ind: number) => {
          HomemanagerRoles.push((data.roles.find(item => item.value === ele)).name);
        });
        result[index]['role_id'] = HomemanagerRoles;
      });
    }
    return result;
  }
  async readData(email: string, Homemanagername: any): Promise<Homemanager> {
    return await this.model.findOne({ "$or": [{ "email": email }, { "Homemanagername": Homemanagername }] }).lean();
  }

  async findById(id: any) {
    id = new ObjectId(id)
    return await this.model.find({ "_id": id })

  }

  async findUnique(Homemanagername: string) {
    let Homemanager = await this.model.aggregate([
      { $match: { $and: [{ Homemanagername, "status": '1' }] } }
    ])
    if (Homemanager.length === 0) {
      return {
        "message": "Invalid Login Credentials!",
        "status": 404,
        "response": []
      }
    }
    return {
      "message": "Homemanager found ",
      "status": 200,
      "response": Homemanager[0]
    };
  }
}
