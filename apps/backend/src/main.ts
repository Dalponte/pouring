import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create a hybrid application that supports both HTTP and microservices
  const app = await NestFactory.create(AppModule);

  // Optional: Enable CORS for WebSocket connections if needed
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Connect the MQTT microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
    },
  });

  // Start all microservices and then listen on HTTP port
  await app.startAllMicroservices();
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('MQTT Microservice is connected');
}

bootstrap();
