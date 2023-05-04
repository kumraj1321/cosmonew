import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataFilingDocument = DataFiling & Document;
@Schema({ collection: 'data_filing', strict: false })

export class DataFiling { }

export const DataFilingSchema = SchemaFactory.createForClass(DataFiling);