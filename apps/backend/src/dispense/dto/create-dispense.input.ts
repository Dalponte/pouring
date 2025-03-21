import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateDispenseInput {
    @Field()
    type: string;

    @Field(() => GraphQLJSON)
    meta: any;

    @Field({ nullable: true })
    tapId?: string;
}
