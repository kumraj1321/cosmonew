import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldStructureDto } from './create-field-structure.dto';

export class UpdateFieldStructureDto extends PartialType(CreateFieldStructureDto) {}
