import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { SettingsModule } from './settings/settings.module';
import { MongooseModule } from '@nestjs/mongoose';
import dbconfig from './config/dbconfig';
// import { UsersModule } from './users/users.module';
import { MongooseModelsModule } from './schemas/mongoose-models.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { CollectionBuilderModule } from './collection-builder/collection-builder.module';
import mongoose from 'mongoose';

setTimeout(()=>{console.log(mongoose.connection.readyState);},10000)
@Module({
  imports: [
    // ServeStaticModule.forRoot({
    // rootPath: join(__dirname, '../..', 'build'),
    // exclude: ['/src*'],
    // }),
    MongooseModule.forRoot(dbconfig.url),
    SettingsModule,    
   // MongooseModelsModule,
 //   UsersModule,
    UserModule, CollectionBuilderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
 }
