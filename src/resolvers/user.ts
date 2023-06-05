import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";
import { string } from "joi";
import argon2 from "argon2";

@InputType()
class UserInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  age: number;
  @Field()
  phone_number: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  _userRepo: Repository<User>;
  constructor() {
    this._userRepo = connectionSource.getRepository(User);
  }

  @Mutation(() => User)
  async register(@Arg("input", () => string) input: UserInput): Promise<User> {
    input.password = await argon2.hash(input.password);
    const user = await User.create({
      ...input,
    }).save();

    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg("email", () => string) email: any,
    @Arg("password", () => string) password: string
  ): Promise<User | null> {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      const matchPassword = await argon2.verify(user.pasword, password);
      if (!matchPassword) {
        throw new Error("Password not match");
      }
    }

    return user;
  }

  @Mutation(() => User)
  async createUser(@Arg("input") input: UserInput): Promise<User> {
    // const validate = await userCreateSchema.validate(input);
    return await User.create({
      ...input,
    }).save();
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("id", () => Int) id: any,
    @Arg("input") input: UserInput
  ): Promise<User> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(User)
      .set({
        name: input.name,
        age: input.age,
        phone_number: input.phone_number,
      })
      .where("id = :id", { id: id })
      .execute();

    return result.raw[0];
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => Int) id: any): Promise<User | null> {
    const user = await this._userRepo.findOneBy({
      id: id,
    });

    return user;
  }

  @Query(() => [User], { nullable: true })
  @UseMiddleware(isAuth)
  async searchUser(
    @Arg("phone_number", () => String, { nullable: true }) phone_number: any,
    @Arg("name", () => String, { nullable: true }) name: any
  ): Promise<User[] | null> {
    const users = this._userRepo.find({
      where: {
        name: name,
        phone_number: phone_number,
      },
    });

    return users;
  }
}
