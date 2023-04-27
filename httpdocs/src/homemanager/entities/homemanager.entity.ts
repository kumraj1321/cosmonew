import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomemanagerDocument = Homemanager & Document;
@Schema({ collection: 'homemanager' })

export class Homemanager {
    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    homemanagername: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    role_id: Array<any>;

    @Prop({ required: true })
    site_id: string;

    @Prop({ required: true })
    status: string;

    @Prop()
    last_login: Date;

    @Prop()
    last_logout: Date;

    @Prop()
    is_login: string;

    @Prop({ default: new Date() })
    created_at: Date;

    @Prop({ default: new Date() })
    updated_at: Date;

}
export const HomemanagerSchema = SchemaFactory.createForClass(Homemanager);
