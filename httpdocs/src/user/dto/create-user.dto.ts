import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
    _id: string; 
    first_name: string;
    last_name: string;
    email: string;    
    username: string;
    password: string;
    role_id: Array<any>;
    site_id: string;
    status: string;
    is_login: string;
    last_login: Date;
    last_logout: Date;
    created_at: Date;
    updated_at: Date;
}


