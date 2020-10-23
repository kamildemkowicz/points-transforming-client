import { GeodeticControlNetworkPoint } from './geodetic-control-network-point.model';
import { PicketMeasurementData } from './picket-measurement-data.model';

export class MeasuringStation {
  stationNumber: number;
  stationName: string;
  startingPoint: GeodeticControlNetworkPoint;
  endPoint: GeodeticControlNetworkPoint;
  picketsMeasurementData: PicketMeasurementData[];
}
