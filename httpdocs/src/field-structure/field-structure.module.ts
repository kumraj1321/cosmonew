import { Module, forwardRef } from '@nestjs/common';
import { FieldStructureService } from './field-structure.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldStructureController } from './field-structure.controller';
import { FieldStructureSchema } from './entities/field-structure.entity';
import { DataFilingService } from 'src/data-filing/data-filing.service';
import { DataFilingController } from 'src/data-filing/data-filing.controller';
import { DataFilingModule } from 'src/data-filing/data-filing.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FieldStructure', schema: FieldStructureSchema }]), forwardRef(() => DataFilingModule)],
  controllers: [FieldStructureController, DataFilingController],
  providers: [FieldStructureService, DataFilingModule],
  exports: [FieldStructureService]
})
export class FieldStructureModule { }
