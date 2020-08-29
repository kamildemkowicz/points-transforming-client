import { HistorySimpleChange } from './history-simple-change.model';

export class HistoryChange {
  measurementChanges: HistorySimpleChange[];
  picketChanges: HistorySimpleChange[];
  dateTime: string;
}
