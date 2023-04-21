import { Controller, Get, Post, Body, Res, Req, Patch, Param } from '@nestjs/common';
import { CollectionBuilderService } from './collection-builder.service';
import { CreateCollectionBuilderDto } from './dto/create-collection-builder.dto';
import { UpdateCollectionBuilderDto } from './dto/update-collection-builder.dto';
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

  @Post('/:name')
  async updateCollection(@Param('name') name: string, @Body() data: Partial<UpdateCollectionBuilderDto>, @Res() res: Response){
      const collectionExists:any = await this.collectionBuilderService.readData(name, 1);

      if(collectionExists.exists){
        await this.collectionBuilderService.updateCollection(name, data.collection)
        .then(async (success:any)=>{
          await this.collectionBuilderService.findAll(1).then((collections:any)=>{
            return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: collections });
          }).catch((err:any)=>{
            return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections:[] });
          })
        })
        .catch((err:any)=>{
          console.log(err)
          return res.render('builder-collections/editcollection', { title: 'Edit Collection', error:{msg:'Collection Name not updated. Contact Admin!'} });
        })
      }else{
        return res.render('builder-collections/editcollection', { title: 'Edit Collection', error:{msg:"Collection you're going to update doesn't exist!"} });
      }
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

  @Get('/editcollection/:name')
  async edituser(@Res() res:Response,@Req() req:Request){
    let name:string = req.params.name
    let collection:any=await this.collectionBuilderService.readData(name, 1);
    console.log(collection)
    if(collection.exists){
      return res.render('builder-collections/editcollection', { title: 'Edit Collection', data:{collection:name} });
    }else{
      return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: collection.data});
    }    
  }
}
