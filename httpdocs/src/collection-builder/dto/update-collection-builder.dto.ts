import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionBuilderDto } from './create-collection-builder.dto';

export class UpdateCollectionBuilderDto extends PartialType(CreateCollectionBuilderDto) {}
