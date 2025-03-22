import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateTagInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    code: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    reference: string;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    meta?: any;
}
