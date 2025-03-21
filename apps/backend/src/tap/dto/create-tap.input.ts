import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateTapInput {
    @Field()
    name: string;

    @Field(() => GraphQLJSON)
    meta: any;
}
