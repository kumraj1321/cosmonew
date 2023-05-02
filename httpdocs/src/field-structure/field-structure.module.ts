import { Module } from '@nestjs/common';
import { FieldStructureService } from './field-structure.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldStructureController } from './field-structure.controller';
import { FieldStructureSchema } from './entities/field-structure.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FieldStructure', schema: FieldStructureSchema }])],
  controllers: [FieldStructureController],
  providers: [FieldStructureService],
  exports: [FieldStructureService]
})
export class FieldStructureModule { }
