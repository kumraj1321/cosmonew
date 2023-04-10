import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import mongoose, { model, Schema } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  // create(createSettingDto: CreateSettingDto):Promise<Setting> {

  //   return 'This action adds a new setting';
  // }


  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    //     var thingSchema = new Schema({ strict: false });
    //     var Thing = mongoose.model('settings', thingSchema);
    //     var thing = new Thing({ name: "ankit" });
    // this.save()
    return 'This action adds a new setting';
    // const data:any = await this.findAll(createStreamDto.langId);
    // return data;
  }


  findAll() {
    return `This action returns all settings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
