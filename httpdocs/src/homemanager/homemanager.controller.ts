import { Controller, Get, Post, Body, Req, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { HomemanagerService } from './homemanager.service';
import { CreateHomemanagerDto } from './dto/create-homemanager.dto';
import { Response, Request } from 'express';

@Controller('Homemanager')
export class HomemanagerController {
  constructor(private readonly HomemanagerService: HomemanagerService) { }


  @Get()
  async findAll(@Res() res: Response) {
    return res.render('homemanager/contentList', { title: 'Create Homemanager', error: {} });
  }

  @Get("/new")
  createUser(@Res() res: Response) {
    return res.render('homemanager/contentCreate', { title: 'Create Homemanager', error: {} });
  }

}
