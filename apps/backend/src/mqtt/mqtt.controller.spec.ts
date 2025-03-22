import { Test, TestingModule } from '@nestjs/testing';
import { MqttController } from './mqtt.controller';
import { QueueService } from '../queue/queue.service';
import { TapEvent } from '../queue/types/tap-event.type';

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

    describe('tap/events', () => {
        it('should call addDispenseJob for dispense events', async () => {
            const dispenseData: TapEvent = {
                type: 'dispense',
                tapId: 'tap-uuid-mock',
                tagId: '9999',
                meta: {
                    state: 'calculating',
                    flowCount: 1999,
                    volume: 300,
                    flowVolumeFactor: 0.5,
                    rfid: '900000',
                },
                message: null,
                timestamp: new Date().toISOString()
            };

            await controller.handleTapEvents(dispenseData);
            expect(queueService.addDispenseJob).toHaveBeenCalledWith(dispenseData);
        });

        it('should not call any job methods for unknown event types', async () => {
            const unknownEventData: TapEvent = {
                type: 'unknown',
                tapId: 'tap-uuid-mock',
                meta: {},
                timestamp: new Date().toISOString()
            };

            await controller.handleTapEvents(unknownEventData);
            expect(queueService.addDispenseJob).not.toHaveBeenCalled();
        });
    });
});
