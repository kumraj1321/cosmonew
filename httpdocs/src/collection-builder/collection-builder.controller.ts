import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CollectionBuilderService } from './collection-builder.service';
import { CreateCollectionBuilderDto } from './dto/create-collection-builder.dto';
import { Response, Request } from 'express';

@Controller('collection-builder')
export class CollectionBuilderController {
  constructor(private readonly collectionBuilderService: CollectionBuilderService) {}

  @Get()
  async findAll(@Res() res: Response){
    await this.collectionBuilderService.findAll(1).then((collections:any)=>{
      return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: collections });
    }).catch((err:any)=>{
      return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections:[] });
    })
  }

  @Get("/new")
  createCollection(@Res() res: Response) {
    return res.render('builder-collections/createCollection', { title: 'Create Collection'});
  }

  @Post()
  async create(@Body() createCollectionBuilderDto: CreateCollectionBuilderDto, @Res() res: Response) {

    const details:any = await this.collectionBuilderService.readData(createCollectionBuilderDto.collection);
    if(!details){
      await this.collectionBuilderService.create(createCollectionBuilderDto).then((collections:any)=>{
        return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections });
      }).catch((err:any)=>{
        return res.render('builder-collections/createCollection', { title: 'Create Collection', error: err.errors});
      })
    }else{
      return res.render('builder-collections/createCollection', { title: 'Create Collection', error: {msg:'Collection already exists'}});
    }

  }
}
