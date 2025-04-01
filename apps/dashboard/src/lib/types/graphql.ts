export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

export type Client = {
    id: string;
    name: string;
    meta: any;
    createdAt: string;
    updatedAt: string;
    deletedAt?: Maybe<string>;
    tags?: Maybe<Array<Tag>>;
};

export type Tag = {
    id: number;
    code: string;
    reference: string;
    meta: any;
    createdAt: string;
    updatedAt: string;
    deletedAt?: Maybe<string>;
    clients?: Maybe<Array<Client>>;
};

export type Tap = {
    id: string;
    name: string;
    meta: any;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    dispenses?: Maybe<Array<Dispense>>;
};

export enum DispenseType {
    AUTO_SERVICE = 'AUTO_SERVICE',
    LOSS = 'LOSS',
    MAINTENANCE = 'MAINTENANCE',
    ORDER = 'ORDER'
}

export type Dispense = {
    id: string;
    type: string;
    meta: any;
    clientId?: Maybe<string>;
    tapId?: Maybe<string>;
    createdAt: string;
    updatedAt: string;
    client?: Maybe<Client>;
    tap?: Maybe<Tap>;
};

export type CreateClientInput = {
    name: string;
    meta?: Maybe<any>;
};

export type UpdateClientInput = {
    name?: Maybe<string>;
    meta?: Maybe<any>;
};

export type CreateTagInput = {
    code: string;
    reference: string;
    meta?: Maybe<any>;
};

export type UpdateTagInput = {
    code?: Maybe<string>;
    reference?: Maybe<string>;
    name?: Maybe<string>;
    description?: Maybe<string>;
    meta?: Maybe<any>;
};

export type CreateTapInput = {
    name: string;
    meta: any;
};

export type UpdateTapInput = {
    name?: Maybe<string>;
    meta?: Maybe<any>;
};

export type CreateDispenseInput = {
    type: DispenseType;
    meta: any;
    tapId: string;
    clientId?: Maybe<string>;
};
