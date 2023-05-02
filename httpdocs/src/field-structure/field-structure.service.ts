import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFieldStructureDto } from './dto/create-field-structure.dto';
import { UpdateFieldStructureDto } from './dto/update-field-structure.dto';
import { FieldStructure, FieldStructureDocument } from './entities/field-structure.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class FieldStructureService {
  constructor (@InjectModel(FieldStructure.name) private readonly model: Model<FieldStructureDocument>) { }
  async create(data: any) {
    await new this.model(data).save()
    return 'This action adds a new fieldStructure';
  }
  async findCollection(data: any) {
    let site_id = data["site_id"]
    let collection_name = data["collection_name"]
    let collectionData: any = await this.model.findOne({ site_id, collection_name })
    return collectionData
  }

  async findFilter(site_id: any, collection_name: any) {
    let data = await this.model.findOne({ site_id, collection_name })
    let recordsTotal: any = 0
    let recordsFiltered: any = 0
    let field_structure: any = []
    let finaldata: any = []
    if (data["field_structure"]) {
      field_structure = JSON.parse(data["field_structure"])
      for (let i = 0; i < field_structure.length; i++) {
        if (field_structure[i][0]) {
          finaldata.push(field_structure[i][0])
        } else {
          finaldata.push(field_structure[i])
        }

      }
      recordsFiltered = field_structure.length
      recordsTotal = field_structure.length

    }
    return {
      data: finaldata,
      recordsFiltered,
      recordsTotal
    }

  }

  async updateUnique(id: any, data: any) {
    id = new ObjectId(id)
    let upadtedata = await this.model.findByIdAndUpdate({ _id: id }, data)
  }

  findAll() {
    return `This action returns all fieldStructure`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldStructure`;
  }

  update(id: number, updateFieldStructureDto: UpdateFieldStructureDto) {
    return `This action updates a #${id} fieldStructure`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldStructure`;
  }
}