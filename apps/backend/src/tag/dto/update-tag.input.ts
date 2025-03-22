import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class UpdateTagInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    code?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    reference?: string;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    meta?: any;
}
