import { PicketReport } from './picket-report.model';
import { PointReport } from './point-report.model';

export class MeasuringStationReport {
  stationNumber: number;
  stationName: string;
  startingPoint: PicketReport;
  endPoint: PicketReport;
  measuringPickets: PointReport[];
}
