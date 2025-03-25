import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsObject, IsOptional, IsUUID } from 'class-validator';
import { DispenseType } from '@prisma/client';

@InputType()
export class CreateDispenseInput {
    @Field(() => DispenseType)
    @IsNotEmpty()
    type: DispenseType;

    @Field(() => Object, { nullable: true })
    @IsObject()
    @IsOptional()
    meta?: Record<string, any>;

    @Field()
    @IsUUID()
    @IsNotEmpty()
    tapId: string;

    @Field({ nullable: true })
    @IsUUID()
    @IsOptional()
    clientId?: string | null;
}
