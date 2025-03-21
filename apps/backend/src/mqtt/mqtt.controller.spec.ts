import { Test, TestingModule } from '@nestjs/testing';
import { MqttController } from './mqtt.controller';
import { QueueService } from '../queue/queue.service';

describe('MqttController', () => {
    let controller: MqttController;
    let queueService: QueueService;

    beforeEach(async () => {
        const queueServiceMock = {
            addDispenseJob: jest.fn(),
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

    describe('handleTapEvents', () => {
        it('should call addDispenseJob for dispense events', async () => {
            const dispenseData = {
                type: 'dispense',
                tapId: '19',
                tapName: 'TAP-1',
                meta: {
                    state: 'calculating',
                    flowCount: 1999,
                    volume: 300,
                    flowVolumeFactor: 0.5,
                    rfid: '900000',
                },
                timestamp: new Date().toISOString()
            };

            await controller.handleTapEvents(dispenseData);
            expect(queueService.addDispenseJob).toHaveBeenCalledWith(dispenseData);
        });

        it('should not call any job methods for unknown event types', async () => {
            const unknownEventData = {
                type: 'unknown',
                tapId: '19',
                tapName: 'TAP-1',
                meta: {},
                timestamp: new Date().toISOString()
            };

            await controller.handleTapEvents(unknownEventData);
            expect(queueService.addDispenseJob).not.toHaveBeenCalled();
        });
    });
});
