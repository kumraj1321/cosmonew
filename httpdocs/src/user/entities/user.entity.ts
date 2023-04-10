import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ collection: 'user'})

export class User {

    @Prop({required:true})
    first_name: string;

    @Prop({required:true})
    last_name: string;

    @Prop({required:true, unique:true})
    email: string;

    @Prop({required:true})
    username: string;

    @Prop({required:true})
    password: string;

    @Prop({required:true})
    role_id: Array<any>;

    @Prop({default: "0"})
    site_id: string;

    @Prop({required:true})
    status: string;

    @Prop()
    last_login: Date;

    @Prop()
    last_logout: Date;

    @Prop()
    is_login: number;

    @Prop({default: new Date()})
    created_at: Date;

    @Prop({default: new Date()})
    updated_at: Date;
    
}
export const UserSchema = SchemaFactory.createForClass(User);
