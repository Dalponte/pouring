import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Directive('@key(fields: "id")')
export class Dispense {
    @Field(type => ID)
    id: number;

    @Field()
    type: string;

    @Field(type => GraphQLJSON)
    meta: any;
}
