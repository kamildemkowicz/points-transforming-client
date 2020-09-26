import { HistorySimpleChange } from './history-simple-change.model';
import { HistoryPicketChange } from './history-picket-change.model';

export class HistoryChange {
  measurementChanges: HistorySimpleChange[];
  picketChanges: HistoryPicketChange[];
  dateTime: string;
}
