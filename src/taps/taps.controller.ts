import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CsvService } from '../csv/csv.service';
import { Interval } from 'src/types';

@Controller('taps')
export class TapsController {
  constructor(private readonly csvService: CsvService) {}

  @UseGuards(AuthGuard('api-key'))
  @Get('/aggregate')
  async getAggregatedData(
    @Query('interval') interval: Interval,
    @Query('start') start: string,
    @Query('end') end: string,
    @Req() req: any,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Check if startDate is after endDate
    if (startDate > endDate) {
      throw new BadRequestException('Invalid date range');
    }

    const teamId = req.user.teamId;
    return this.csvService.getAggregatedData(
      teamId,
      startDate,
      endDate,
      interval,
    );
  }
}
