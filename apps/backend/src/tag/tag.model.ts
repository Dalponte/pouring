import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Client } from '../client/client.model';

@ObjectType()
export class Tag {
    @Field(() => Int)
    id: number;

    @Field()
    code: string;

    @Field()
    reference: string;

    @Field(() => GraphQLJSON)
    meta: any;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;

    @Field(() => [Client], { nullable: true })
    clients?: Client[];
}
