import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as moment from 'moment';
import { Interval, AggregatedData } from 'src/types';

@Injectable()
export class CsvService {
  constructor() {}

  async readCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  async getAggregatedData(
    teamId: string,
    startDate: Date,
    endDate: Date,
    interval: Interval,
  ): Promise<AggregatedData[]> {
    const tagsData = await this.readCsv('./data/interview-tags.csv');
    const tapsData = await this.readCsv('./data/interview-taps.csv');

    const teamTags = tagsData
      .filter((tag) => tag.team_id === teamId)
      .map((tag) => tag.tag_uid);

    const filteredTaps = tapsData.filter(
      (tap) =>
        teamTags.includes(tap.tag_uid) &&
        moment(tap.created_at).isBetween(
          moment(startDate),
          moment(endDate),
          undefined,
          '[]',
        ),
    );

    const aggregatedData = filteredTaps.reduce((acc, tap) => {
      const tapDate = moment(tap.created_at)
        .startOf(interval)
        .format('YYYY-MM-DD');
      if (!acc[tapDate]) {
        acc[tapDate] = 0;
      }
      acc[tapDate] += parseInt(tap.count, 10); // Ensure count is treated as a number
      return acc;
    }, {});

    return Object.entries(aggregatedData).map(
      ([date, count]): AggregatedData => ({
        date,
        count: Number(count),
      }),
    );
  }
}
