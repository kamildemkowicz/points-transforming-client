import { MeasuringStation } from './measuring-station.model';
import { TachymetryMetaData } from './tachymetry-meta-data.model';

export class Tachymetry {
  internalMeasurementId: string;
  tachymetryMetaData: TachymetryMetaData;
  measuringStations: MeasuringStation[];
}
