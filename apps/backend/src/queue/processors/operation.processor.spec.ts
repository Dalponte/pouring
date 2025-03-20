import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { OperationProcessor } from './operation.processor';
import { Operation } from '@prisma/client';

describe('OperationProcessor', () => {
    let processor: OperationProcessor;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OperationProcessor,
                {
                    provide: PrismaService,
                    useValue: {
                        operation: {
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        processor = module.get<OperationProcessor>(OperationProcessor);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(processor).toBeDefined();
    });

    describe('process', () => {
        const operationData: Operation = {
            id: 'mock-id',
            tapId: '19',
            tapName: 'TAP-1',
            operationId: 99,
            client: 9,
            meta: {
                state: 'calculating',
                flowCount: 1999,
                volume: 300,
                flowVolumeFactor: 0.5,
                rfid: '900000',
            },
            timestamp: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should process an operation job and store it in the database', async () => {
            const job = {
                data: operationData,
            } as Job;

            jest.spyOn(prismaService.operation, 'create').mockResolvedValue(operationData);

            const result = await processor.process(job);
            expect(result).toEqual({
                processed: true,
                operationId: operationData.id,
            });

            expect(prismaService.operation.create).toHaveBeenCalledWith({
                data: {
                    tapId: operationData.tapId,
                    tapName: operationData.tapName,
                    operationId: operationData.operationId,
                    client: operationData.client,
                    meta: operationData.meta,
                    timestamp: operationData.timestamp,
                },
            });
        });
    });
});
