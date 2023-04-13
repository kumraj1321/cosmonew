import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
// var session = require('express-session')
import { ValidationPipe } from '@nestjs/common';
import customHelpers from "./services/customHelper";
// import * as helperLib from "handlebars-helpers";
var helperLib = require('handlebars-helpers')();
dotenv.config();
// console.log(helperLib)
async function bootstrap() {
  const optLayout = process.env.OPT_LAYOUT;
  console.log(optLayout);
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, '..', 'views/', optLayout, 'assets'))
  app.setBaseViewsDir(join(__dirname, '..', 'views/', optLayout, 'pages'))
  app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '..', '/views/', optLayout, 'layouts'),
    partialsDir: join(__dirname, '..', '/views/', optLayout, 'partials'),
    helpers: {...customHelpers, ...helperLib},
  }))
//   app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true,maxAge: 20 },
//   }))
  app.setViewEngine('hbs')
  app.useGlobalPipes(new ValidationPipe());
  const port = parseInt(process.env.PORT, 10) || 3000;
  console.log('Runnin on ', port)
  await app.listen(port);
}
bootstrap();
