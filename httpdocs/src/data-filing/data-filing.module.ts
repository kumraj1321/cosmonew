import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataFilingService } from './data-filing.service';
import { DataFilingController } from './data-filing.controller';
import { DataFilingSchema } from './entities/data-filing.entity';
import { FieldStructureModule } from 'src/field-structure/field-structure.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'DataFiling', schema: DataFilingSchema }]), forwardRef(() => FieldStructureModule)],
  controllers: [DataFilingController],
  providers: [DataFilingService],
  exports: [DataFilingService]
})
export class DataFilingModule { }
