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
  async removedb_name(site_id: any, collection_name: any, db_name: any) {
    let data = await this.model.findOne({ site_id, collection_name })
    let recordsTotal: any = 0
    let recordsFiltered: any = 0
    let field_structure: any = []
    let finaldata: any = []
    let dataid: any = data["_id"]
    if (data["field_structure"]) {
      field_structure = JSON.parse(data["field_structure"])
      for (let i = 0; i < field_structure.length; i++) {
        if (field_structure[i][0]) {

          let x: any = field_structure[i][0]
          if (x["db_name"] != db_name) {
            finaldata.push(x)
          }
        } else {
          let x: any = field_structure[i]
          if (x["db_name"] != db_name) {
            finaldata.push(x)
          }

        }

      }
      let updatedfield_structure = JSON.stringify(finaldata)
      // data["field_structure"] = updatedfield_structure
      await this.model.updateOne({ "_id": dataid }, { $set: { "field_structure": updatedfield_structure } })
      recordsFiltered = finaldata.length
      recordsTotal = field_structure.length - 1

    }
    return {
      data: finaldata,
      recordsFiltered,
      recordsTotal
    }
  }

  async allmultiselect(site_id: any, collection_name: any, selecttype: any) {
    let fieldstructuredata = await this.model.findOne({ site_id, collection_name })
    let field_structure: any = fieldstructuredata["field_structure"] ? fieldstructuredata["field_structure"] : []
    field_structure = JSON.parse(field_structure)
    let result: any = []
    for (let i = 0; i < field_structure.length; i++) {
      if (field_structure[i]["field_type"] && field_structure[i]["field_type"] === selecttype) {
        result.push(field_structure[i]["db_name"])
      }
    }
    return result
  }

  async selectedoptions(site_id: any, collection_name: any, collection_selected: any) {
    let fieldstructuredata = await this.model.findOne({ site_id, collection_name })
    let field_structure: any = fieldstructuredata["field_structure"] ? fieldstructuredata["field_structure"] : []
    field_structure = JSON.parse(field_structure)
    let result: any = []
    for (let i = 0; i < field_structure.length; i++) {
      if (field_structure[i]["field_type"] && field_structure[i]["field_type"] === 'dynamicSelect' && field_structure[i]["collection_selected"] === collection_selected) {
        result.push(field_structure[i]["field_selected"])
      }
    }
    return result
  }

  async uniqueField(site_id: any, collection_name: any, field_value: any) {
    if (site_id.length === 0 || collection_name.length === 0 || field_value.length === 0) {
      return false
    }
    field_value = field_value.trim()
    let data = await this.model.findOne({ site_id, collection_name })
    let field_structure = data.field_structure ? JSON.parse(data.field_structure) : ''
    if (field_structure === '') {
      return true
    }
    let result: any = true
    field_structure.forEach(stru => {
      if (stru.field_name === field_value) {
        result = false
      }
    });
    return result
  }

  async allCollection(site_id: any) {
    let data = await this.model.find({ site_id })
    let result: any = []
    for (let i = 0; i < data.length; i++) {
      let a: any = {}
      a["collection_name"] = data[i]["collection_name"]

      let field_structure: any = JSON.parse(data[i]["field_structure"])
      let fields: any = []
      let db_name: any = []
      for (let j = 0; j < field_structure.length; j++) {
        if (field_structure[j]["field_type"] === 'text') {
          fields.push(field_structure[j]["field_name"])
          db_name.push(field_structure[j]["db_name"])
        }
      }
      a["field_name"] = fields
      a["db_name"] = db_name
      result.push(a)
    }
    return result
  }

  async updateUnique(id: any, data: any) {
    id = new ObjectId(id)
    let upadtedata = await this.model.findByIdAndUpdate({ _id: id }, data)
    if (upadtedata) {
      return {
        "status": 200,
        "message": "Data updated successfully"
      }
    } else {
      return {
        "status": 500,
        "message": "Some error occured in insertion"
      }
    }
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
