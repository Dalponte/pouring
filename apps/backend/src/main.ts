import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_BROKER
    },
  });

  await app.listen();
  console.log('MQTT Microservice está rodando...');
}

bootstrap();
