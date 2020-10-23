import { TachymetryMetaData } from '../tachymetry-meta-data.model';
import { MeasuringStationReport } from './measuring-station-report.model';

export class TachymetryReport {
  internalMeasurementId: string;
  tachymetryMetaData: TachymetryMetaData;
  measuringStations: MeasuringStationReport[];
}
