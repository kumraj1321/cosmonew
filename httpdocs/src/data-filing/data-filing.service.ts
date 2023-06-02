import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDataFilingDto } from './dto/create-data-filing.dto';
import { UpdateDataFilingDto } from './dto/update-data-filing.dto';
import { DataFiling, DataFilingDocument } from './entities/data-filing.entity';
import { filter } from 'rxjs';
import { FieldStructureService } from 'src/field-structure/field-structure.service';
import { ObjectId } from 'mongodb'

@Injectable()
export class DataFilingService {
  constructor (@InjectModel(DataFiling.name) private readonly model: Model<DataFilingDocument>) { }
  async create(data: any) {
    await new this.model(data).save()
    return 'Data Filed successfully';
  }

  async multiselect(collection_name: any, field_name: any, site_id: any) {
    let servicedata: any = await this.model.find({ collection_name, site_id })
    let result: any = []
    for (let i = 0; i < servicedata.length; i++) {
      let a: any = {}
      a["key"] = servicedata[i]["_id"] ? servicedata[i]["_id"] : ''
      a["value"] = servicedata[i][field_name] ? servicedata[i][field_name] : ''
      result.push(a)
    }
    return result
  }
  async findUnique(data: any) {

    let site_id = data["site_id"].trim()
    let collection_name = data["collection_name"].trim()
    let field_name = data["field_name"].trim()
    let field_value = data["field_value"].trim()
    let reqid: any = ''
    if (data["_id"]) {
      reqid = data["_id"].trim()
    }

    let query: any = { site_id: site_id, collection_name: collection_name }
    query[field_name] = field_value
    let result = await this.model.aggregate([
      { $match: query }
    ])
    if (result.length === 1 && reqid != '') {
      let id = String(result[0]["_id"])
      if (id === reqid) {
        result = []
      }
    }
    return result
  }
  // async allmultiselect(site_id: any, collection_name: any, selecttype: any) {
  //   console.log("site id and collection name from all multiselect in data filing service", site_id, collection_name, selecttype)
  //   // let data=await  this.collection('field-structure').aggregate([])
  //   // let data = await this.fieldStructureService.allCollection(site_id)
  //   // console.log("data of the data filing service", data)
  // }

  async tabledata(site_id: any, collection_name: any, search: any, start: any, length: any) {
    let filterdata = await this.model.find({ site_id, collection_name })
    let total_records = filterdata.length
    if (search && search.length > 0) {
      search = new RegExp(search, 'i')
      filterdata = await this.model.aggregate([
        //here condition for search will come (on which field search will work)
        { $match: { site_id, collection_name } }
      ])
    }
    let end = start + length
    if (end > filterdata.length) {
      end = filterdata.length
    }
    let finalresult: any = []
    for (let i = start; i < end; i++) {
      finalresult.push(filterdata[i])
    }
    return {
      data: finalresult,
      total_records: total_records,
      recordsFiltered: filterdata.length
    }
  }

  findAll() {
    return `This action returns all dataFiling`;
  }
  async updateById(id: any, data: any) {
    id = new ObjectId(id)
    let res = await this.model.findByIdAndUpdate(id, data)
    return res
  }
  async findOne(id: any) {
    id = new ObjectId(id)
    let data = await this.model.findById(id)
    return data
  }

  update(id: number, updateDataFilingDto: UpdateDataFilingDto) {
    return `This action updates a #${id} dataFiling`;
  }

  remove(id: number) {
    return `This action removes a #${id} dataFiling`;
  }
}
