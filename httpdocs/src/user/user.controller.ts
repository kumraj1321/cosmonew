import { Controller, Get, Post, Body,Req, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import data from "../services/data"
import * as CryptoJS from 'crypto-js'
// let jwt=require("jsonwebtoken")

@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const details:any = await this.userService.readData(createUserDto.email, createUserDto.username);

    if(details === null){ //user not found then create
      createUserDto["password"] = CryptoJS.AES.encrypt(createUserDto["password"], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9').toString();    
      await this.userService.create(createUserDto).then((users:any) =>{
        return res.render('users/userlist', { title: 'Users', users });
      }).catch((err:any)=>{
        return res.render('users/createUser', { title: 'Create User', error: err.errors});
      });
    }else{
      return res.render('users/createUser', { title: 'Create User', error: {msg:"Email already exists"}});
    }   
  }
  @Post('/login')
  async login(@Res() res: Response,@Req() req:Request) {
    
    let username=req.body.username
    let result= await this.userService.findUnique(username)
    console.log(result,"=====result")
    if(result.status===404){
      return  res.render('login', { layout: 'withoutHeadFoot', data:result,err:"Invalid Login Credentials!"  });

    }else{
      const bytes = CryptoJS.AES.decrypt(result["response"]["password"], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      const decryptdPassword = bytes.toString(CryptoJS.enc.Utf8);
      if(decryptdPassword!=req.body.password ){
        return  res.render('login', { layout: 'withoutHeadFoot',data:result,err:"Invalid Login Credentials!" });

      }
      // let response=result["response"]
      // let payload:any={id:response["_id"],email:response["email"],username:response["username"],first_name:response["first_name"],last_name:response["last_name"]}
      // let token=jwt.sign({payload},"thisissecretkey",{expiresIn: 86400})
      // // localStorage.setItem('USER_TOKEN',JSON.stringify(token))
      // // console.log("token",token)
      // // console.log("================")
      // // console.log("localstoreage.get",localStorage.getItem('USER_TOKEN'))
      return  res.render('dashboard', { title: 'Users' });
    }
  }
  @Get()
  async findAll(@Res() res: Response) {
    await this.userService.findAll().then( (users:any ) =>{
      console.log(users)
      return res.render('users/userlist', { title: 'Users', users:users });
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
