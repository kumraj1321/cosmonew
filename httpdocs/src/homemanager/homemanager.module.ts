import { Module } from '@nestjs/common';
import { HomemanagerService } from './homemanager.service';
import { HomemanagerController } from './homemanager.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HomemanagerSchema } from './entities/homemanager.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Homemanager', schema: HomemanagerSchema }])],
  controllers: [HomemanagerController],
  providers: [HomemanagerService]
})
export class HomemanagerModule { }
