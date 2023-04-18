import { Controller, Get, Res, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/blank')
  getBlank(@Res() res: Response) {
    /* return res.render('home',{layout:'layout1',message:'Hello World!'}); */
    return res.render('blank', { title: 'Hello World' });
  }
  @Get('/dashboard')
  getDashboard(@Res() res: Response) {
    /* return res.render('home',{layout:'layout1',message:'Hello World!'}); */
    return res.render('dashboard', { title: 'Hello dashboard' });
  }

  @Get('/')
  getabc(@Res() res: Response) {
    /* return res.render('home',{layout:'layout1',message:'Hello World!'}); */
    return res.render('login', { layout: 'withoutHeadFoot' });
  }
  @Get('/login')
  getMain(@Res() res: Response) {
    /* return res.render('home',{layout:'layout1',message:'Hello World!'}); */
    return res.render('login', { layout: 'withoutHeadFoot' });
  }

  @Post('readUser')
  readUser(@Body('email') email: string, @Body('password') password: string){
  }
}
