import { PartialType } from '@nestjs/mapped-types';
import { CreateDataFilingDto } from './create-data-filing.dto';

export class UpdateDataFilingDto extends PartialType(CreateDataFilingDto) {}
