import { Controller, Get, Post, Body, Res, Req, Patch, Param } from '@nestjs/common';
import { CollectionBuilderService } from './collection-builder.service';
import { CreateCollectionBuilderDto } from './dto/create-collection-builder.dto';
import { UpdateCollectionBuilderDto } from './dto/update-collection-builder.dto';
import { Response, Request } from 'express';
import settings from 'src/config/settings';

@Controller('collection-builder')
export class CollectionBuilderController {
  constructor (private readonly collectionBuilderService: CollectionBuilderService) { }

  @Get()
  async findAll(@Res() res: Response) {
    await this.collectionBuilderService.findAll(1).then((collections: any) => {
      return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: collections });
    }).catch((err: any) => {
      return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: [] });
    })
  }

  @Post('fields')
  async fieldInsert(@Req() req: Request, @Res() res: Response) {

  }

  @Get('/collectionManager/:collectionName')
  async collectionManager(@Res() res: Response, @Req() req: Request) {
    let collectionName = req.params.collectionName
    return res.render('builder-collections/collectionManager', { collection: collectionName })
  }



  // @Get('/addField')
  // async addField(@Res() res: Response, @Req() req: Request) {
  //   return res.render('builder-collections/addField', { settings, collection_name: req.query["collection_name"] })
  // }

  @Get("/view")
  async viewBuilderAssets(@Res() res: Response) {
    await this.collectionBuilderService.findAll(1).then((collections: any) => {
      return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: collections });
    }).catch((err: any) => {
      return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: [] });
    })
  }

  @Post('/:name')
  async updateCollection(@Param('name') name: string, @Body() data: Partial<UpdateCollectionBuilderDto>, @Res() res: Response) {
    const collectionExists: any = await this.collectionBuilderService.readData(name, 1);

    if (collectionExists.exists) {
      await this.collectionBuilderService.updateCollection(name, data.collection)
        .then(async (success: any) => {
          await this.collectionBuilderService.findAll(1).then((collections: any) => {
            return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: collections });
          }).catch((err: any) => {
            return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: [] });
          })
        })
        .catch((err: any) => {
          console.log(err)
          return res.render('builder-collections/editcollection', { title: 'Edit Collection', error: { msg: 'Collection Name not updated. Contact Admin!' } });
        })
    } else {
      return res.render('builder-collections/editcollection', { title: 'Edit Collection', error: { msg: "Collection you're going to update doesn't exist!" } });
    }
  }

  @Get("/new")
  createCollection(@Res() res: Response) {
    return res.render('builder-collections/createCollection', { title: 'Create Collection' });
  }

  @Post()
  async create(@Body() createCollectionBuilderDto: CreateCollectionBuilderDto, @Res() res: Response) {

    const details: any = await this.collectionBuilderService.readData(createCollectionBuilderDto.collection);
    if (!details) {
      await this.collectionBuilderService.create(createCollectionBuilderDto).then((collections: any) => {
        // return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections });
        // console.log(settings)
        return res.render('collections/collection-entity', { title: 'Entity Selection', settings });
      }).catch((err: any) => {
        return res.render('builder-collections/createCollection', { title: 'Create Collection', error: err.errors });
      })
    } else {
      return res.render('builder-collections/createCollection', { title: 'Create Collection', error: { msg: 'Collection already exists' } });
    }
  }

  @Get('/collection-entity')
  async showEntityForm(@Res() res: Response) {
    // console.log(settings)
    return res.render('collections/collection-entity', { title: 'Entity Selection', settings });
  }

  @Get('/editcollection/:name')
  async edituser(@Res() res: Response, @Req() req: Request) {
    let name: string = req.params.name
    // console.log("name of the params", name)
    let collection: any = await this.collectionBuilderService.readData(name, 1);
    if (collection.exists) {
      return res.render('builder-collections/editcollection', { title: 'Edit Collection', data: { collection: name } });
    } else {
      return res.render('builder-collections/collection-list', { title: 'Builder Collections', collections: collection.data });
    }
  }
}
