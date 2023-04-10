import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ collection: 'user' })

export class User {

    @Prop()
    first_name: string;

    @Prop()
    last_name: string;

    @Prop({required:true})
    email: string;

    @Prop({required:true})
    username: string;

    @Prop({required:true})
    password: string;

    @Prop()
    role_id: string;

    @Prop()
    site_id: string;

    @Prop()
    status: string;

    @Prop({default: new Date()})
    created_at: Date;

    @Prop({default: new Date()})
    updated_at: Date;
    
}
export const UserSchema = SchemaFactory.createForClass(User);
