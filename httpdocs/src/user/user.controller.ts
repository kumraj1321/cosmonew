import { Controller, Get, Post, Body,Req, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import * as CryptoJS from 'crypto-js'
let jwt=require("jsonwebtoken")

@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    createUserDto["status"] = (createUserDto.status === "on") ? "1" : "0";
    createUserDto["password"] = CryptoJS.AES.encrypt(createUserDto["password"], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9').toString();    

    //jwt verification
    let token=createUserDto["token"]
    console.log(token,"token====")
    jwt.verify(token,'thisissecretkey',(err:any,result:any)=>{
      if(err){
        console.log("verification error",err)
      }else{
        console.log("verification successful")
      }
    })

    await this.userService.create(createUserDto).then((succ:any) =>{
      return res.render('users/userlist', { title: 'Users' });
    }).catch((err:any)=>{
     // throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      return res.render('users/createUser', { title: 'Create User', error: err.errors});
    });
   
  }
  @Post('/login')
  async login(@Res() res: Response,@Req() req:Request) {
    console.log("req.body==",req["session"])
    req["session"].isAuthenticated=true
    console.log("req.body==",req["session"].isAuthenticated)
    let username=req.body.username
    let result= await this.userService.findUnique(username)
    if(result.status===404){
      return  res.render('login', { layout: 'withoutHeadFoot', data:result,error:"Invalid Login Credentials!"  });

    }else{
      const bytes = CryptoJS.AES.decrypt(result["response"]["password"], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      const decryptdPassword = bytes.toString(CryptoJS.enc.Utf8);
      if(decryptdPassword!=req.body.password ){
        return  res.render('login', { layout: 'withoutHeadFoot',data:result,error:"Invalid Login Credentials!" });

      }
      let response=result["response"]
      let payload:any={id:response["_id"],email:response["email"],username:response["username"],first_name:response["first_name"],last_name:response["last_name"]}
      let token=jwt.sign({payload},"thisissecretkey",{expiresIn: 86400})
      // localStorage.setItem('USER_TOKEN',JSON.stringify(token))
      // console.log("token",token)
      // console.log("================")
      // console.log("localstoreage.get",localStorage.getItem('USER_TOKEN'))
      return  res.render('dashboard', { title: 'Users',token:token });
    }
  }
  @Get()
  async findAll(@Res() res: Response) {
    await this.userService.findAll().then( (users:any ) =>{
      console.log(users)
      return res.render('users/userlist', { title: 'Users', users:users });
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
