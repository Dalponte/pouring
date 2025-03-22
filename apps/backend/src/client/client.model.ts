import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class Client {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field(() => GraphQLJSON)
    meta: any;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;
}
