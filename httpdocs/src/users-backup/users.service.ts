import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { USER_MODEL, UserDocument } from "../schemas/user";
import { CreateUserDTO, UpdateUserDTO } from "./dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>
  ) { }

  async create(inputData: CreateUserDTO) {
    // try {
    //   const createdUser = await this.userModel.create(inputData);
    //   return createdUser;
    // } catch (error) {
    //   return error
    //   // if (error.name === "ValidationError") {
    //   //   throw new BadRequestException(error.errors);
    //   // }

    //   // throw new ServiceUnavailableException();
    // }
  }

  async findAll() {
    // const users = await this.userModel.find();

    // return users;
  }

  async findOne(id: string) {
    // const user = await this.userModel.findById(id);

    // if (!user) {
    //   throw new NotFoundException("User not found");
    // }

    // return user;
  }

  async update(id: string, inputData: UpdateUserDTO) {
    // const updatedUser = await this.userModel.findByIdAndUpdate(
    //   id,
    //   inputData,
    //   {
    //     new: true,
    //   }
    // );

    // if (!updatedUser) {
    //   throw new NotFoundException("User not found");
    // }

    // return updatedUser;
  }

  async remove(id: string) {
    // const deletedUser = await this.userModel.findByIdAndDelete(id);

    // if (!deletedUser) {
    //   throw new NotFoundException("User not found");
    // }

    // return {
    //   _id: id,
    // };
  }
}
