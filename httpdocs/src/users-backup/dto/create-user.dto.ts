import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean
} from "class-validator";
import { AddressDTO } from "../../common_dto/address.dto";
import { ACCOUNT_TYPE } from "../../constants";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  //@IsNumber()
  @IsOptional()
  role_id?: string;

  //@IsNumber()
  @IsOptional()
  site_id?: string;

  @IsBoolean()
  @IsNotEmpty()
  status: string;

  created_at:Date;
  updated_at:Date
}
