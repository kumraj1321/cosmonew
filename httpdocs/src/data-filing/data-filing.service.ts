import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDataFilingDto } from './dto/create-data-filing.dto';
import { UpdateDataFilingDto } from './dto/update-data-filing.dto';
import { DataFiling, DataFilingDocument } from './entities/data-filing.entity';
import { filter } from 'rxjs';
import { ObjectId } from 'mongodb'

@Injectable()
export class DataFilingService {
  constructor (@InjectModel(DataFiling.name) private readonly model: Model<DataFilingDocument>) { }
  async create(data: any) {
    await new this.model(data).save()
    return 'Data Filed successfully';
  }

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
    console.log("id and data from service", id, data)
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
