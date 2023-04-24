import { Controller, UseGuards, Get, Post, Body, Req, Patch, Param, Res, Delete, Render, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import data from "../services/data"
import * as CryptoJS from 'crypto-js'
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { get } from 'http';
@Controller('users')
export class UserController {
  constructor (private readonly userService: UserService) { }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response, @Req() req: Request) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }


    const details: any = await this.userService.readData(createUserDto.email, createUserDto.username);

    if (details === null) { //user not found then create
      createUserDto["password"] = CryptoJS.AES.encrypt(createUserDto["password"], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9').toString();
      await this.userService.create(createUserDto).then(async (users: any) => {
        await this.userService.findAll().then((users: any) => {
          return res.render('users/userlist', { title: 'Users', users: users });
        }).catch((e) => {
          return res.render('users/userlist', { title: 'Users', users: [] });
        })
        return res.render('users/userlist', { title: 'Users', users });
      }).catch((err: any) => {
        return res.render('users/createUser', { title: 'Create User', error: err.errors });
      });
    } else {
      return res.render('users/createUser', { title: 'Create User', error: { msg: "Email already exists" } });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/edituser/:id')
  async edituser(@Res() res: Response, @Req() req: Request) {
    console.log(req["session"])
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }

    let successmessage = ''
    if (Object.keys(req.query).length > 0) {
      let updatedata: any = req.query
      if (updatedata["password"]) {
        updatedata["password"] = CryptoJS.AES.encrypt(updatedata["password"], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9').toString();
      }
      await this.userService.updateById(req.params.id, updatedata)
      successmessage = 'Data Saved Successfully'
    }
    let id = req.params.id
    let user: any = await this.userService.findById(id)
    user = user[0]
    let password = user["password"]
    const bytes = CryptoJS.AES.decrypt(password, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    const decryptdPassword = bytes.toString(CryptoJS.enc.Utf8);
    user["password"] = decryptdPassword
    return res.render('users/edituser', { title: 'Create User', successmessage, roles: data.roles, data: user, site_id: user["site_id"], role_id: user['role_id'], status: user["status"] },);
  }

  @Patch('/:id')
  async editUser(@Res() res: Response, @Req() req: Request) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Res() res: Response, @Req() req: Request) {
    console.log(req["session"]["passport"]["user"]["Error"])
    let username = req.body.username
    let password = req.body.password
    let result = await this.userService.findUnique(username, password)
    if (result === null) {
      return res.render('login', { layout: 'withoutHeadFoot', data: result, err: "Invalid Login Credentials!" });

    } else {
      //update query to set login time and islogin variables
      try {
        await this.userService.setLoginInfo(result["_id"])

        return res.render('dashboard', { title: 'Users' });
      } catch (e: any) {
        return res.render('login', { layout: 'withoutHeadFoot', data: result, err: "Invalid Login Credentials!" });
      }

    }
  }


  @UseGuards(AuthenticatedGuard)
  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    await this.userService.findAll().then((users: any) => {
      return res.render('users/userlist', { title: 'Users', users: users });
    }).catch((err: any) => {
      return res.render('users/userlist', { title: 'Users', users: [] });
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req["session"].destroy()
    return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Logout successful,Please login again to continue!" });
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/new")
  createUser(@Res() res: Response, @Req() req: Request) {
    if (!req["session"] || !req["session"]["passport"] || !req["session"]["passport"]["user"] || req["session"]["passport"]["user"]["Error"]) {
      return res.render('login', { layout: 'withoutHeadFoot', data: [], err: "Session expired! Please login." });

    }
    return res.render('users/createUser', { title: 'Create User', roles: data.roles });
  }
}
