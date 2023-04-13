import { Controller, Get, Post, Body, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import data from "../services/data"
@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {

    const details:any = await this.userService.readData(createUserDto.email, createUserDto.username);

    if(details === null){ //user not found then create
      await this.userService.create(createUserDto).then((users:any) =>{
        return res.render('users/userlist', { title: 'Users', users });
      }).catch((err:any)=>{
        return res.render('users/createUser', { title: 'Create User', error: err.errors});
      });
    }else{
      return res.render('users/createUser', { title: 'Create User', error: {msg:"Email already exists"}});
    }   
  }

  @Get()
  async findAll(@Res() res: Response) {
    await this.userService.findAll().then( (users:any ) =>{
      return res.render('users/userlist', { title: 'Users', users });
    }).catch((err:any) => {
     // throw new BadRequestException(err)
      console.log(err)
      return res.render('users/userlist', { title: 'Users', users: [] });
    });
  }
  
  @Get("/new")
  createUser(@Res() res: Response) {
    return res.render('users/createUser', { title: 'Create User', roles: data.roles });
  }
}
