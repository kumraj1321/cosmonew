import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class CollectionBuilderService {
  constructor (
    @InjectConnection() private connection: Connection
  ) { }

  async create(collection: any) {
    await this.connection.db.createCollection('builder_' + collection.collection + '_entity');
    return await this.findAll(1);
  }

  async findAll(validateBuilderCollections: number = 0) {

    const collections: Array<any> = await this.connection.db.listCollections({}, { nameOnly: true }).toArray();
    if (validateBuilderCollections === 1) {
      const listedCollections: Array<any> = [];

      collections.forEach(async (item: any, index: number) => {

        const exploded: Array<any> = (item.name).split("_");
        if ((exploded.length === 3) && (exploded[0] === 'builder') && (exploded[2] === 'entity')) {
          const documentsList: any = await this.connection.db.collection(item.name).find().toArray();
          listedCollections.push({
            name: exploded[1].charAt(0).toUpperCase() + exploded[1].slice(1),
            originalName: exploded[1],
            showEdit: (documentsList.length > 0) ? false : true
          });
        }
      })
      return listedCollections;
    } else {
      return collections
    }
  }

  async readData(collectionName: string, returnList: number = 0) {
    const collectionList = await this.findAll();
    let exists: boolean = false;
    collectionList.forEach((item: any, index: number) => {
      if (item.name === 'builder_' + collectionName + '_entity') {
        exists = true;
      }
    })
    if (returnList) {
      return { data: collectionList, exists }
    } else {
      return exists;
    }
    //return await this.connection.db.admin().validateCollection(collectionName);
  }

  async updateCollection(from: string, to: string) {
    return await this.connection.db.renameCollection('builder_' + from + '_entity', 'builder_' + to + '_entity');
  }
}
