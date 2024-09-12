import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { RunModule } from './run/run.module';
import { AuthModule } from './auth/auth.module';
import { ScanModule } from './scan/scan.module';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema }),
    DatabaseModule,
    RunModule,
    AuthModule,
    ScanModule,
    NotificationModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
