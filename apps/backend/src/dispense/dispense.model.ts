import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Tap } from '../tap/tap.model';

@ObjectType()
@Directive('@key(fields: "id")')
export class Dispense {
    constructor() {
        // Empty constructor to make the class instantiable
    }

    @Field(type => ID)
    id: number;

    @Field()
    type: string;

    @Field(type => GraphQLJSON)
    meta: any;

    @Field(type => Tap, { nullable: true })
    tap?: Tap;

    @Field({ nullable: true })
    tapId?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
