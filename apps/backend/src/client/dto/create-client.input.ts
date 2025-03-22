import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateClientInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    meta?: any;
}
