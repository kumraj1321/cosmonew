import { Controller, UseGuards, Get, Post, Body, Req, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { DataFilingService } from './data-filing.service';
import { Request, Response, response } from 'express';
import { CreateDataFilingDto } from './dto/create-data-filing.dto';
import { UpdateDataFilingDto } from './dto/update-data-filing.dto';
import data from 'src/services/data';

@Controller('data-filing')
export class DataFilingController {
  constructor (private readonly dataFilingService: DataFilingService) { }

  @Post()
  async create(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    let site_id = req["session"]["passport"]["user"]["site_id"]
    let user_id = req["session"]["passport"]["user"]["_id"]
    let data: any = { ...req.body, site_id, user_id, created_at: new Date(), updated_at: new Date() }
    let responsedata = await this.dataFilingService.create(data)
  }

  @Post('/edit/:id')
  async edit(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    // let site_id = req["session"]["passport"]["user"]["site_id"]
    let user_id = req["session"]["passport"]["user"]["_id"]
    let data: any = { ...req.body, user_id, updated_at: new Date() }
    let id = req.params["id"]
    let responsedata = await this.dataFilingService.updateById(req.params.id, data)

  }

  @Get('/tabledata/:id')
  async tabledata(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    let search = req.query.search["value"]
    let start = req.query.start
    let length = req.query.length
    let draw = req.query.draw
    let site_id: any = req["session"]["passport"]["user"]["site_id"]
    let collection_name = req.params["id"]
    // console.log("req.query===>", req.query)
    console.log("search start length and draw", search, start, length, draw, req.params["id"])
    await this.dataFilingService.tabledata(site_id, collection_name, search, start, length).then((result: any) => {
      let finalresult: any = {}
      finalresult["draw"] = draw
      finalresult["data"] = result["data"]
      finalresult["recordsTotal"] = result["total_records"]
      finalresult["recordsFiltered"] = result["recordsFiltered"]
      return res.json(finalresult)
    }).catch((err: any) => {
      console.log("error of the data filing", err)
    })
    // return this.dataFilingService.findAll();
  }

  @Get()
  findAll() {
    return this.dataFilingService.findAll();
  }

  @Get(':id')
  findOne(@Req() req: Request, @Res() res: Response) {
    let id = req.params.id
    return res.render('builder-collections/collectionListing', { title: 'Builder Collections', collections: [], collection_name: id });

    // return res.render('/builder-collections/collectionListing', { collection_name: id })
    // return res.json({ id })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDataFilingDto: UpdateDataFilingDto) {
    return this.dataFilingService.update(+id, updateDataFilingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataFilingService.remove(+id);
  }
}
