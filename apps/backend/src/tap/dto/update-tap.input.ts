import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class UpdateTapInput {
    @Field({ nullable: true })
    name?: string;

    @Field(() => GraphQLJSON, { nullable: true })
    meta?: any;
}
