import { Test, TestingModule } from '@nestjs/testing';
import { MqttController } from './mqtt.controller';
import { QueueService } from '../queue/queue.service';

describe('MqttController', () => {
    let controller: MqttController;
    let queueService: QueueService;

    beforeEach(async () => {
        const queueServiceMock = {
            addOperationJob: jest.fn(),
            addTelemetryJob: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [MqttController],
            providers: [
                {
                    provide: QueueService,
                    useValue: queueServiceMock,
                },
            ],
        }).compile();

        controller = module.get<MqttController>(MqttController);
        queueService = module.get<QueueService>(QueueService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('handleOperation', () => {
        it('should call addOperationJob on the queue service', async () => {
            const operationData = {
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
                timestamp: new Date().toISOString()
            };

            await controller.handleOperation(operationData);
            expect(queueService.addOperationJob).toHaveBeenCalledWith(operationData);
        });
    });

    describe('handleTelemetry', () => {
        it('should call addTelemetryJob on the queue service', async () => {
            const telemetryData = {
                tapId: '19',
                tapName: 'TAP-1',
                operationId: null,
                client: null,
                meta: {
                    state: 'calibrating',
                    flowCount: 1999,
                    volume: 300,
                    flowVolumeFactor: 0.5,
                    rfid: null,
                },
                timestamp: new Date().toISOString()
            };

            await controller.handleTelemetry(telemetryData);
            expect(queueService.addTelemetryJob).toHaveBeenCalledWith(telemetryData);
        });
    });
});
