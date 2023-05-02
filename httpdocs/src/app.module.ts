import { Module, UseFilters } from '@nestjs/common';
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
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';
import { HomemanagerModule } from './homemanager/homemanager.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { CollectionBuilderModule } from './collection-builder/collection-builder.module'
import { FieldStructureModule } from './field-structure/field-structure.module';

setTimeout(() => { console.log(mongoose.connection.readyState); }, 10000)
@Module({
  imports: [

    MongooseModule.forRoot(dbconfig.url),
    SettingsModule,
    UserModule, AuthModule, CollectionBuilderModule, FieldStructureModule, HomemanagerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

@UseFilters(new HttpExceptionFilter())
export class AppModule {
}
