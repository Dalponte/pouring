import { GraphQLJSON } from 'graphql-type-json';

export interface TapEvent {
    tapId: string;
    type: string;
    tagId?: string;
    meta?: any;
    message?: string | null;
    timestamp?: string;
}
