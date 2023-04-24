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
<<<<<<< HEAD
import { AuthModule } from './auth/auth.module';
=======
import { CollectionBuilderModule } from './collection-builder/collection-builder.module';
>>>>>>> 7d631b02655883f259069d2c84162eeed075bd3a
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
<<<<<<< HEAD
    UserModule, AuthModule
=======
    UserModule, CollectionBuilderModule
>>>>>>> 7d631b02655883f259069d2c84162eeed075bd3a
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
 }
