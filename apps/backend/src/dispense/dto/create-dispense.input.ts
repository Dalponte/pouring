import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsObject, IsOptional, IsUUID } from 'class-validator';
import { DispenseType } from '@prisma/client';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateDispenseInput {
    @Field(() => DispenseType)
    @IsNotEmpty()
    type: DispenseType;

    @Field(() => GraphQLJSON)
    meta: any;

    @Field()
    @IsUUID()
    @IsNotEmpty()
    tapId: string;

    @Field(() => String, { nullable: true })
    @IsUUID()
    @IsOptional()
    clientId?: string;
}
