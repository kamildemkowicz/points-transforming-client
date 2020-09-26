import { Picket } from '../../measurements/pickets/picket.model';
import { HistorySimpleChange } from './history-simple-change.model';

export class HistoryPicketChange {
  picket: Picket;
  picketSimpleChanges: HistorySimpleChange[];
  type: string;
}
