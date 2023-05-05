import { Controller, UseGuards, Get, Post, Body, Req, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { FieldStructureService } from './field-structure.service';
import { DataFilingService } from 'src/data-filing/data-filing.service';
import { CreateFieldStructureDto } from './dto/create-field-structure.dto';
import { UpdateFieldStructureDto } from './dto/update-field-structure.dto';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { table } from 'console';

@Controller('field-structure')
export class FieldStructureController {
  constructor (private readonly fieldStructureService: FieldStructureService, private readonly dataFilingService: DataFilingService) { }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    let site_id = req["session"]["passport"]["user"]["site_id"]
    let user_id = req["session"]["passport"]["user"]["_id"]
    let field_structure: any = { ...req.body }
    console.log("field_strucure from controller file", field_structure)
    delete field_structure["collection_name"]
    if (field_structure["field_type"] === 'radio') {
      let field_value = field_structure["field_value"]
      field_value = field_value.split("\r\n")
      let fieldvalue: any = []
      for (let i = 0; i < field_value.length; i++) {
        let a: any = {}
        let aa = field_value[i].split(':')
        if (aa.length === 2) {

          a["key"] = aa[0]
          a["value"] = aa[1]
          fieldvalue.push(a)
        }
      }
      field_structure["field_value"] = fieldvalue
    }
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


  @Get('/partialManager')
  async partialManager(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }

    let site_id: any = req["session"]["passport"]["user"]["site_id"]
    let collection_name = req.query["collection_name"]
    let data = await this.fieldStructureService.findCollection({ site_id, collection_name })
    let finaldata = JSON.parse(data["field_structure"])

    // return res.render('builder-collections/editPartialManager', { filingdata: '', collectionData: finaldata, collection_name: data["collection_name"] })

    return res.render('builder-collections/partialManager', { collectionData: finaldata, collection_name: data["collection_name"] })
  }

  @Get('/editPartialManager/:id')
  async editPartialManager(@Req() req: Request, @Res() res: Response) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    let id: any = req.params["id"]
    let filingdata: any = await this.dataFilingService.findOne(id)
    if (Object.keys(filingdata).length > 0) {
      let site_id: any = filingdata["site_id"]
      let collection_name = filingdata["collection_name"]
      let data = await this.fieldStructureService.findCollection({ site_id, collection_name })
      let finaldata = JSON.parse(data["field_structure"])
      return res.render('builder-collections/editPartialManager', { filingdata, collectionData: finaldata, collection_name: data["collection_name"] })
    } else {
      return res.render('builder-collections/editPartialManager', { filingdata: '', collectionData: [], collection_name: '' })
    }

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
