import { Module } from '@nestjs/common';
import { CollectionBuilderService } from './collection-builder.service';
import { CollectionBuilderController } from './collection-builder.controller';

@Module({
  controllers: [CollectionBuilderController],
  providers: [CollectionBuilderService]
})
export class CollectionBuilderModule {}
