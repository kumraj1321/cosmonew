import { Controller, UseGuards, Get, Post, Body, Req, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { FieldStructureService } from './field-structure.service';
import { CreateFieldStructureDto } from './dto/create-field-structure.dto';
import { UpdateFieldStructureDto } from './dto/update-field-structure.dto';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { table } from 'console';

@Controller('field-structure')
export class FieldStructureController {
  constructor (private readonly fieldStructureService: FieldStructureService) { }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    let site_id = req["session"]["passport"]["user"]["site_id"]
    let user_id = req["session"]["passport"]["user"]["_id"]
    let field_structure: any = { "field_name": req.body.field_name, "field_type": req.body.field_type }
    let collection_name: any = req.body["collection_name"]
    let data = await this.fieldStructureService.findCollection({ site_id, collection_name })

    if (data) {

      let fieldStructure = JSON.parse(data["field_structure"])
      fieldStructure.push(field_structure)
      field_structure = JSON.stringify(fieldStructure)
      return this.fieldStructureService.updateUnique(data["_id"], { site_id, user_id, field_structure, collection_name })
    } else {
      field_structure = JSON.stringify([field_structure])
      return this.fieldStructureService.create({ site_id, user_id, field_structure, collection_name });
    }

  }
  @Post('/dataEntry')
  async dataEntry(@Req() req: Request, @Res() res: Response) {
    console.log("req.query of data entry", req.query)
    console.log("req.body of data entry", req.body)
    console.log("req.params of data entry", req.params)
  }


  @Get('/partialManager')
  async partialManager(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    let site_id: any = req["session"]["passport"]["user"]["site_id"]
    let collection_name = req.query["collection_name"]
    let data = await this.fieldStructureService.findCollection({ site_id, collection_name })
    let finaldata = JSON.parse(data["field_structure"])
    return res.render('builder-collections/partialManager', { collectionData: finaldata })
  }

  @Get()
  findAll(@Req() req: Request, @Res() res: Response) {
    return this.fieldStructureService.findAll();
  }

  @Post('/getdata')
  getdata(@Req() req: Request, @Res() res: Response) {
    return { data: [] }

  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async findOne(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    let site_id: any = req["session"]["passport"]["user"]["site_id"]
    let search = req.query.search["value"]
    let start = req.query.start
    let length = req.query.length
    let draw = req.query.draw
    let result = await this.fieldStructureService.findFilter(site_id, req.params["id"])
    let finalresult: any = {}
    finalresult["draw"] = draw
    finalresult["data"] = result["data"]
    finalresult["recordsTotal"] = result["total_records"]
    finalresult["recordsFiltered"] = result["recordsFiltered"]
    return res.json(finalresult)

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldStructureDto: UpdateFieldStructureDto) {
    return this.fieldStructureService.update(+id, updateFieldStructureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldStructureService.remove(+id);
  }
}