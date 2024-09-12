import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { LoggingInterceptor } from './interceptors/loggin.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: 'maxoptra.loader.v1',
        protoPath: join(__dirname, '/protos/maxoptra/loader/v1/api.proto'),
        loader: {
          keepCase: true,
          includeDirs: [join(__dirname, '/protos/')],
        },
      },
    },
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.listen();
}
bootstrap();
