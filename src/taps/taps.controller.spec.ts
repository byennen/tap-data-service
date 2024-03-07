import { Test, TestingModule } from '@nestjs/testing';
import { TapsController } from './taps.controller';
import { CsvService } from '../csv/csv.service';
import * as moment from 'moment';

// Sample mock data
const mockTagsData = [
  { tag_uid: 'tag1', team_id: '1', created_at: '2022-07-01T00:00:00Z' },
  { tag_uid: 'tag2', team_id: '2', created_at: '2022-07-01T00:00:00Z' },
];

const mockTapsData = [
  { tag_uid: 'tag1', count: '5', created_at: '2022-07-01T12:00:00Z' },
  { tag_uid: 'tag1', count: '10', created_at: '2022-07-02T12:00:00Z' },
  { tag_uid: 'tag2', count: '15', created_at: '2022-07-01T12:00:00Z' },
];

describe('TapsController', () => {
  let controller: TapsController;
  let service: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TapsController],
      providers: [
        {
          provide: CsvService,
          useValue: {
            getAggregatedData: jest.fn(
              (teamId, startDate, endDate, interval) => {
                const startMoment = moment(startDate);
                const endMoment = moment(endDate);
                const filteredTaps = mockTapsData.filter(
                  (tap) =>
                    mockTagsData.some(
                      (tag) =>
                        tag.tag_uid === tap.tag_uid && tag.team_id === teamId,
                    ) &&
                    moment(tap.created_at).isBetween(
                      startMoment,
                      endMoment,
                      null,
                      '[]',
                    ),
                );

                // Initialize an object to hold aggregated counts by date
                const aggregatedData = {};

                // Aggregate counts by date
                filteredTaps.forEach((tap) => {
                  const dateKey = moment(tap.created_at)
                    .startOf(interval as moment.unitOfTime.StartOf)
                    .format('YYYY-MM-DD');
                  if (!aggregatedData[dateKey]) {
                    aggregatedData[dateKey] = 0;
                  }
                  aggregatedData[dateKey] += parseInt(tap.count, 10);
                });

                // Convert the aggregated data object into an array of { date, count } objects
                return Promise.resolve(
                  Object.entries(aggregatedData).map(([date, count]) => ({
                    date,
                    count,
                  })),
                );
              },
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<TapsController>(TapsController);
    service = module.get<CsvService>(CsvService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('aggregates daily data correctly for a given team', async () => {
    const teamId = '1';
    const interval = 'day';
    const startDate = new Date('2022-07-01');
    const endDate = new Date('2022-07-03');

    const result = await controller.getAggregatedData(
      interval,
      startDate.toISOString(),
      endDate.toISOString(),
      { user: { teamId } },
    );
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        { date: '2022-07-01', count: 5 },
        { date: '2022-07-02', count: 10 },
      ]),
    );
  });

  it('aggregates weekly data correctly for a given team', async () => {
    const teamId = '1';
    const interval = 'week';
    const startDate = '2022-06-26';
    const endDate = '2022-07-31';

    const result = await controller.getAggregatedData(
      interval,
      startDate,
      endDate,
      { user: { teamId } },
    );

    expect(result).toHaveLength(1);
    expect(result).toEqual(
      expect.arrayContaining([{ count: 15, date: '2022-06-26' }]),
    );
  });

  it('aggregates monthly data correctly for a given team', async () => {
    const teamId = '1';
    const interval = 'month';
    const startDate = '2022-07-01';
    const endDate = '2022-07-31';

    const result = await controller.getAggregatedData(
      interval,
      startDate,
      endDate,
      { user: { teamId } },
    );

    // Assuming mock data that matches the criteria
    expect(result).toHaveLength(1);
    expect(result).toEqual(
      expect.arrayContaining([
        { date: '2022-07-01', count: expect.any(Number) },
      ]),
    );
  });

  it('handles invalid date range correctly', async () => {
    const teamId = '1';
    const interval = 'day';
    const startDate = '2022-07-31';
    const endDate = '2022-07-01';

    await expect(
      controller.getAggregatedData(interval, startDate, endDate, {
        user: { teamId },
      }),
    ).rejects.toThrow('Invalid date range');
  });

  it('returns empty array when no data is available for the team', async () => {
    const teamId = '999'; // Assuming no data for this team
    const interval = 'day';
    const startDate = '2022-07-01';
    const endDate = '2022-07-02';

    const result = await controller.getAggregatedData(
      interval,
      startDate,
      endDate,
      { user: { teamId } },
    );

    expect(result).toHaveLength(0);
  });
});
