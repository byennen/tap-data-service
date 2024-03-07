export type Interval = 'month' | 'week' | 'day';

export interface AggregatedData {
  date: string;
  count: number;
}
