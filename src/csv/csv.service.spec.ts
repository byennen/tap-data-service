import { Test, TestingModule } from '@nestjs/testing';
import { CsvService } from './csv.service';
import * as moment from 'moment';
import * as fs from 'fs';

// Sample mock data
const mockTagsData = [
  { tag_uid: 'tag1', team_id: '1' },
  { tag_uid: 'tag2', team_id: '2' },
];

const mockTapsData = [
  { tag_uid: 'tag1', created_at: '2022-07-01T12:00:00Z', count: '10' },
  { tag_uid: 'tag1', created_at: '2022-07-02T12:00:00Z', count: '15' },
  { tag_uid: 'tag2', created_at: '2022-07-01T12:00:00Z', count: '20' },
];

describe('CsvService', () => {
  let service: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvService],
    }).compile();

    service = module.get<CsvService>(CsvService);

    // Mock readCsv method to return mock data
    jest.spyOn(service, 'readCsv').mockImplementation((filePath: string) => {
      if (filePath.includes('tags')) {
        return Promise.resolve(mockTagsData);
      } else if (filePath.includes('taps')) {
        return Promise.resolve(mockTapsData);
      }
      return Promise.resolve([]);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAggregatedData', () => {
    it('should aggregate data daily', async () => {
      const aggregatedData = await service.getAggregatedData(
        '1',
        new Date('2022-07-01'),
        new Date('2022-07-03'),
        'day',
      );
      expect(aggregatedData).toEqual([
        { date: '2022-07-01', count: 10 },
        { date: '2022-07-02', count: 15 },
      ]);
    });

    it('should aggregate data weekly', async () => {
      const aggregatedData = await service.getAggregatedData(
        '1',
        new Date('2022-06-27'),
        new Date('2022-07-03'),
        'week',
      );
      expect(aggregatedData).toEqual([
        {
          date: moment('2022-06-27').startOf('week').format('YYYY-MM-DD'),
          count: 25,
        },
      ]);
    });

    it('should aggregate data monthly', async () => {
      const aggregatedData = await service.getAggregatedData(
        '1',
        new Date('2022-07-01'),
        new Date('2022-07-31'),
        'month',
      );
      expect(aggregatedData).toEqual([{ date: '2022-07-01', count: 25 }]);
    });

    it('should handle no data for a team', async () => {
      const aggregatedData = await service.getAggregatedData(
        '3',
        new Date('2022-07-01'),
        new Date('2022-07-31'),
        'day',
      );
      expect(aggregatedData).toEqual([]);
    });

    it('should aggregate data across month boundary', async () => {
      const aggregatedData = await service.getAggregatedData(
        '1',
        new Date('2022-07-01'),
        new Date('2022-12-31'),
        'day',
      );
      expect(aggregatedData.length).toBeGreaterThan(0);
    });

    it('should return empty array for invalid date range', async () => {
      const aggregatedData = await service.getAggregatedData(
        '1',
        new Date('2022-07-02'),
        new Date('2022-07-01'),
        'day',
      );
      expect(aggregatedData).toEqual([]);
    });

    it('should handle errors gracefully when CSV files are missing', async () => {
      jest
        .spyOn(service, 'readCsv')
        .mockRejectedValue(new Error('File not found'));
      await expect(
        service.getAggregatedData(
          '1',
          new Date('2022-07-01'),
          new Date('2022-07-31'),
          'day',
        ),
      ).rejects.toThrow('File not found');
    });
  });

  describe('readCsv', () => {
    it('successfully reads CSV data', async () => {
      const filePath = './data/interview-tags.csv';
      const result = await service.readCsv(filePath);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
