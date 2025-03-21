import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Dispense } from '../dispense/dispense.model';

@ObjectType()
@Directive('@key(fields: "id")')
export class Tap {
    constructor() {
        // Empty constructor to make the class instantiable
    }

    @Field(type => ID)
    id: string;

    @Field()
    name: string;

    @Field(type => GraphQLJSON)
    meta: any;

    @Field(type => [Dispense], { nullable: true })
    dispenses?: Dispense[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field()
    deleted: boolean;
}
