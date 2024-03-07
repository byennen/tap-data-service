import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvModule } from './csv/csv.module';
import { TapsModule } from './taps/taps.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 3600, // 1 hour
        limit: 100, // limit each IP to 100 requests per ttl
      },
    ]),
    AuthModule,
    CsvModule,
    TapsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
