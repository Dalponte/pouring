import { Test, TestingModule } from '@nestjs/testing';
import { AutoServiceProcessor } from './auto-service.processor';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { TapEvent } from '../types/tap-event.type';
import { Dispense, DispenseType } from '@prisma/client';

describe('AutoServiceProcessor', () => {
    let processor: AutoServiceProcessor;
    let prismaService: PrismaService;
    let eventEmitter: EventEmitter2;

    const mockEventEmitter = {
        emit: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AutoServiceProcessor,
                PrismaService,
                { provide: EventEmitter2, useValue: mockEventEmitter },
            ],
        }).compile();

        processor = module.get<AutoServiceProcessor>(AutoServiceProcessor);
        prismaService = module.get<PrismaService>(PrismaService);
        eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(processor).toBeDefined();
    });

    describe('process', () => {
        it('should process a tap event and create a dispense record', async () => {
            const mockTapEvent: TapEvent = {
                type: DispenseType.AUTO_SERVICE,
                meta: { volume: 500 },
                tapId: 'tap-123',
            };

            const mockJob = {
                data: mockTapEvent,
            } as Job<TapEvent, any, string>;

            const mockDispense: Dispense = {
                id: 1,
                type: DispenseType.AUTO_SERVICE,
                meta: { volume: 500 },
                tapId: 'tap-123',
                clientId: 'client-123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(prismaService.dispense, 'create').mockResolvedValue(mockDispense);

            const result = await processor.process(mockJob);

            expect(prismaService.dispense.create).toHaveBeenCalledWith({
                data: {
                    type: DispenseType.AUTO_SERVICE,
                    meta: { volume: 500 },
                    tap: { connect: { id: 'tap-123' } },
                    client: undefined,
                },
                include: {
                    tap: true,
                    client: true,
                },
            });

            expect(mockEventEmitter.emit).toHaveBeenCalledWith(
                'dispense.created',
                mockDispense,
            );

            expect(result).toEqual({
                processed: true,
                dispenseId: 1,
            });
        });
    });
});
