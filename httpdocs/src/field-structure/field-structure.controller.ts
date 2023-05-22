import { Controller, UseGuards, Get, Post, Body, Req, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { FieldStructureService } from './field-structure.service';
import { DataFilingService } from 'src/data-filing/data-filing.service';
import { CreateFieldStructureDto } from './dto/create-field-structure.dto';
import { UpdateFieldStructureDto } from './dto/update-field-structure.dto';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { table } from 'console';
import settings from 'src/config/settings';
import { all } from 'axios';

@Controller('field-structure')
export class FieldStructureController {
  constructor (private readonly fieldStructureService: FieldStructureService, private readonly dataFilingService: DataFilingService) { }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Res() res: Response, @Req() req: Request) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    let site_id = req["session"]["passport"]["user"]["site_id"]
    let user_id = req["session"]["passport"]["user"]["_id"]
    let field_structure: any = { ...req.body }
    delete field_structure["collection_name"]
    if (field_structure["field_type"] === 'radio' || field_structure["field_type"] === 'staticSelect') {
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
    let select_field = field_structure["field_type"]
    let collection_name: any = req.body["collection_name"]
    let data = await this.fieldStructureService.findCollection({ site_id, collection_name })
    let alldata = await this.fieldStructureService.allCollection(site_id)
    if (data) {

      let fieldStructure = JSON.parse(data["field_structure"])
      fieldStructure.push(field_structure)

      field_structure = JSON.stringify(fieldStructure)
      let datarecieved = await this.fieldStructureService.updateUnique(data["_id"], { site_id, user_id, field_structure, collection_name })


      if (datarecieved.status === 200) {

        return res.render('builder-collections/addField', { settings, collection_name: collection_name, alldata, select_field: select_field, success: "Field inserted successfully!" })

      } else {
        return res.render('builder-collections/addField', { settings, collection_name: collection_name, alldata, select_field: select_field, error: "Some error occured. Please try again!" })
      }
    } else {
      field_structure = JSON.stringify([field_structure])
      await this.fieldStructureService.create({ site_id, user_id, field_structure, collection_name });
      return res.render('builder-collections/addField', { settings, collection_name: collection_name, alldata, select_field: select_field, success: "Field inserted successfully!" })

    }

  }


  @Get('/addField')
  async addField(@Res() res: Response, @Req() req: Request) {
    console.log("add field here", req)
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });
    }
    let site_id = req["session"]["passport"]["user"]["site_id"]
    console.log("add field from here and site id", site_id)
    let alldata = await this.fieldStructureService.allCollection(site_id)
    let select_field: any = 'text'
    if (req.query.field_select && req.query.field_select != '') {
      select_field = req.query.field_select
    }
    return res.render('builder-collections/addField', { settings, collection_name: req.query["collection_name"], alldata, select_field: select_field })
  }

  @Get('addField/:selectField/:collection_name')
  async selectField(@Res() res: Response, @Req() req: Request) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });
    }
    let select_field = req.params["selectField"]
    let collection_name = req.params["collection_name"]
    let site_id = req["session"]["passport"]["user"]["site_id"]
    let alldata = await this.fieldStructureService.allCollection(site_id)
    if (select_field === 'undefined') {
      select_field = 'text'
    }
    return res.render('builder-collections/addField', { settings, collection_name: collection_name, alldata, select_field })
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

    return res.render('builder-collections/partialManager', { collectionData: finaldata, site_id, collection_name: data["collection_name"] })
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

      return res.render('builder-collections/editPartialManager', { filingdata, collectionData: finaldata, site_id, collection_name: data["collection_name"] })
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
