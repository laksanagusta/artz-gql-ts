import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  // UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import argon2 from "argon2";
import Jwt from "jsonwebtoken";
import { __jwt_secret } from "../config/credentials";

@InputType()
class UserInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  phone_number: string;
  @Field()
  password: string;
}

@InputType()
class UserUpdate {
  @Field()
  name: string;
  @Field()
  phone_number: string;
}

@ObjectType()
class SearchUserResult {
  @Field()
  count: number;
  @Field(() => [User])
  users: User[];
}

@Resolver()
export class UserResolver {
  _userRepo: Repository<User>;
  constructor() {
    this._userRepo = connectionSource.getRepository(User);
  }

  @Mutation(() => User)
  async register(@Arg("input") input: UserInput): Promise<User> {
    input.password = await argon2.hash(input.password);

    console.log(input);
    const user = await User.create({
      ...input,
    }).save();

    user.token = "";

    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg("email", () => String) email: any,
    @Arg("password", () => String) password: string
  ): Promise<User | null> {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Email/Password is wrong");
    }

    const matchPassword = await argon2.verify(user.password, password);
    if (!matchPassword) {
      throw new Error("Email/Password is wrong");
    }
    const token = Jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      __jwt_secret ?? ""
    );

    user.token = token;
    user.save();

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
    @Arg("input") input: UserUpdate
  ): Promise<User> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(User)
      .set({
        name: input.name,
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

  @Query(() => SearchUserResult, { nullable: true })
  async searchUser(
    @Arg("name", () => String, { nullable: true }) name: any,
    @Arg("limit", () => Number, { nullable: true }) limit: any,
    @Arg("page", () => Number, { nullable: true }) page: any
  ): Promise<SearchUserResult | null> {
    const users = this._userRepo.createQueryBuilder("user");

    if (name) {
      users.where(
        "lower(user.name) LIKE :name OR lower(user.name) LIKE :name",
        {
          name: `%${name.toLowerCase()}%`,
        }
      );
    }

    const count = await users.getCount();

    if (page) {
      users.skip(page);
    }

    if (limit) {
      users.take(limit);
    }

    users.orderBy("user.id", "DESC");

    const userResult = await users.getMany();

    return {
      count,
      users: userResult,
    };
  }
}
