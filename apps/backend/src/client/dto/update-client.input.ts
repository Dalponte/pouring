import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class UpdateClientInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    meta?: any;
}
