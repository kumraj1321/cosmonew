import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Res,
  BadRequestException,
  Req,
  All,
  HttpException,
  HttpStatus,
  Next,
  
  UseInterceptors,
} from "@nestjs/common";

import { CreateUserDTO, UpdateUserDTO } from "./dto";
import { UsersService } from "./users.service";
import { Response, Request } from 'express';
import { User } from "src/schemas/user";
import { NestApplication } from "@nestjs/core";
import axios from 'axios';
import { delay } from "rxjs";
// import { ErrorsInterceptor } from "./errors.interceptor";
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
   //return this.usersService.create(createUserDto);
  }

  // findAll(@Res() res: Response) {
  //   return res.render('settings', { title: 'Hello setting' });
  // }

  @Get()
  findAll(@Res() res: Response)  {
    console.log('hi')
    return res.render('users/userlist', { title: 'Users' });
    // let finalData = {}
    // this.usersService.findAll()
    //   .then((res: any) => {
    //     finalData = res;
    //   }).catch((err) => {
    //     throw new BadRequestException(err)
    //   })
    // return res.render('users/userlist', finalData);
  }

  @Get("/new")
  createUser(@Res() res: Response) {
    console.log('hi')
    return res.render('users/createUser', { title: 'Create User' });
    // let finalData = {}
    // this.usersService.findAll()
    //   .then((res: any) => {
    //     finalData = res;
    //   }).catch((err) => {
    //     throw new BadRequestException(err)
    //   })
    // return res.render('users/userlist', finalData);
  }


  // @All("/new")//get and post both
  // @Render('users/createUser')
  // // @UseInterceptors(ErrorsInterceptor)
  // async createNewData(@Res() res: any, @Req() req: Request) {
  //   console.log("--CreateUserDTO", req.body, Object.keys(req.body).length)


  //   if (Object.keys(req.body).length > 0) {
  //     // let finalResp = {}
  //     return await this.usersService.create(req.body)
  //       .then((resp) => {
  //         // console.log("==resp-->", resp)
  //         return { "data": req.body, "response": resp, "status": 200, 'error': { "popat": 1 } }
  //       })
  //       .catch((err) => {
  //         // console.log("==catch-->", err.response)
  //         // console.log("==catch-err->", err)
  //         // var encodedError = err.message.replace(/[\u00A0-\u9999<>\&]/gim, function (i: any) {
  //         //   return '&#' + i.charCodeAt(0) + ';';
  //         // });
  //         // console.log("===popat----------------->", encodedError)
  //         return { "data": req.body, "response": [], "status": 200, "error": err }

  //       })
  //   }
  //   // try {





  //   // .catch(err => {
  //   //   // If validation error flash array of messages and redirect
  //   //   // let errorMessages = err.response.map((el: any) => { console.log("==>popat-->", el.message) })
  //   //   console.log("---->error", err)
  //   //   // console.log("---->error", err.getResponse().map((el: any) => { console.log("==>popat-->", el) }))
  //   //   // console.log("---->errorMessages---", err.response.email.properties.message)
  //   //   return ({ message: "All fields required", data: req.body, error: err })
  //   //   // console.log("---->errorMessages---", err)
  //   //   // req.flash('validationFailure', errorMessages)
  //   //   // res.status(400).render('users/createUser');
  //   // })



  //   // .catch(err => res.status(400).render('users/createUser', { data: res, "error": err }, Next));
  //   //   .catch (err => {
  //   //   res.status(400)
  //   //   console.log("catch-->", err)
  //   //   return err;
  //   // });

  //   // return res.render('users/createUser', { data: req.body });
  //   // } catch (exception) {
  //   //   console.log("--catch-->", exception)
  //   // }

  //   // async createNewData(@Res() res: Response, @Req() req: Request) {
  //   // let finalResponse: any = {
  //   //   success: true,
  //   //   data: req.body
  //   // }
  //   // console.log("-->req.body", req.body)
  //   // if (Object.keys(req.body).length < 1) {
  //   //   return res.render('users/createUser');
  //   // }
  //   // try {
  //   //   const user = await this.usersService.create(req.body);
  //   //   return res.render('users/createUser', finalResponse);
  //   // } catch (error) {
  //   //   // finalResponse.success = false;
  //   //   // finalResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
  //   //   // finalResponse.errors = error.getResponse();
  //   //   // finalResponse.data = req.body;
  //   //   // console.log('==errr->', finalResponse)
  //   //   // return res.render('users/createUser', finalResponse);
  //   //   console.log("catch-->", error)
  //   // }

  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Put(":id")
  // update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDTO) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.usersService.remove(id);
  // }
}
