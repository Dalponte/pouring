import { DispenseType } from '@prisma/client';

export interface TapEvent {
    tapId: string;
    type: DispenseType;
    tagId?: string;
    meta?: Record<string, any>;
    message?: string | null;
    timestamp?: string;
}
