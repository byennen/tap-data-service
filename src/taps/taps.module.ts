import { Module } from '@nestjs/common';
import { TapsController } from './taps.controller';
import { CsvModule } from '../csv/csv.module';

@Module({
  imports: [CsvModule],
  controllers: [TapsController],
})
export class TapsModule {}
