import { PartialType } from '@nestjs/mapped-types';
import { CreateHomemanagerDto } from './create-homemanager.dto';

export class UpdateHomemanagerDto extends PartialType(CreateHomemanagerDto) { }
