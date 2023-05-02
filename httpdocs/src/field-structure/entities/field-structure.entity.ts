import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FieldStructureDocument = FieldStructure & Document;
@Schema({ collection: 'field_structure' })
export class FieldStructure {
    @Prop({ required: true })
    site_id: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    field_structure: string;

    @Prop({ required: true })
    collection_name: string;


}
export const FieldStructureSchema = SchemaFactory.createForClass(FieldStructure);