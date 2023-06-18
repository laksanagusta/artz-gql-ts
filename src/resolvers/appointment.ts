import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Appointment } from "../entities/Appointment";
import { connectionSource } from "../config/ormconfig";
import { Repository } from "typeorm";
import { isAuth } from "../middleware/auth";

@InputType()
class MemberAppointmentInput {
  @Field()
  id: number;
}

@InputType()
class AppointmentInput {
  @Field()
  name: string;
  @Field()
  scheduled_at: string;
  @Field()
  day_text: string;
  @Field(() => MemberAppointmentInput)
  member?: MemberAppointmentInput;
}

@ObjectType()
class SearchAppointmentResult {
  @Field()
  count: number;
  @Field(() => [Appointment])
  appointments: Appointment[];
}

@Resolver()
export class AppointmentResolver {
  _appointmentRepo: Repository<Appointment>;
  constructor() {
    this._appointmentRepo = connectionSource.getRepository(Appointment);
  }

  @Mutation(() => Appointment)
  async createAppointment(
    @Arg("input") input: AppointmentInput
  ): Promise<Appointment> {
    return await Appointment.create({
      ...input,
    }).save();
  }

  @Mutation(() => Appointment, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAppointment(
    @Arg("id", () => Int) id: any,
    @Arg("input") input: AppointmentInput
  ): Promise<Appointment> {
    const result = await connectionSource
      .createQueryBuilder()
      .update(Appointment)
      .set({
        name: input.name,
      })
      .where("id = :id", { id: id })
      .execute();

    return result.raw[0];
  }

  @Query(() => Appointment, { nullable: true })
  async appointment(
    @Arg("id", () => Int) id: any
  ): Promise<Appointment | null> {
    const appointment = await this._appointmentRepo.findOneBy({
      id: id,
    });

    return appointment;
  }

  @Query(() => SearchAppointmentResult, { nullable: true })
  async searchAppointment(
    @Arg("name", () => String, { nullable: true }) name: any,
    @Arg("limit", () => Number, { nullable: true }) limit: any,
    @Arg("page", () => Number, { nullable: true }) page: any
  ): Promise<SearchAppointmentResult | null> {
    const appointments =
      this._appointmentRepo.createQueryBuilder("appointment");

    const offset = page * limit;

    if (name) {
      appointments.where("lower(appointment.name) LIKE :name", {
        name: `%${name.toLowerCase()}%`,
      });
    }

    const count = await appointments.getCount();

    if (page) {
      appointments.skip(offset);
    }

    if (limit) {
      appointments.take(limit);
    }

    appointments.orderBy("appointment.id", "DESC");

    const appointmentResult = await appointments.getMany();

    return {
      count,
      appointments: appointmentResult,
    };
  }
}
