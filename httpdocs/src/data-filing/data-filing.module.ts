import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataFilingService } from './data-filing.service';
import { DataFilingController } from './data-filing.controller';
import { DataFilingSchema } from './entities/data-filing.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'DataFiling', schema: DataFilingSchema }])],
  controllers: [DataFilingController],
  providers: [DataFilingService],
  exports: [DataFilingService]
})
export class DataFilingModule { }
