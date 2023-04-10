import { Controller, Get, Post, Body, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';

@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    console.log(createUserDto)
    createUserDto["status"] = (createUserDto.status === "on") ? "1" : "0";
    await this.userService.create(createUserDto).then((succ:any) =>{
      //const data:any = succ;
      return res.render('users/userlist', { title: 'Users' });
    }).catch((err:any)=>{
     // throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
     console.log(err)
      return res.render('users/createUser', { title: 'Create User', error: err.errors});
    });
   
  }
  @Get()
  async findAll(@Res() res: Response) {

    await this.userService.findAll().then( (users:any ) =>{
      console.log(users)
      return res.render('users/userlist', { title: 'Users', users });
    }).catch((err:any) => {
      return res.render('users/userlist', { title: 'Users', users: [] });
    });
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
}
