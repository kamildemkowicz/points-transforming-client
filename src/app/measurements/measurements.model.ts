import { Picket } from './pickets/picket.model';
import { District } from './district/district.model';

export class MeasurementsModel {
  measurementInternalId: string;
  name: string;
  creationDate: string;
  place: string;
  owner: string;
  district: District;
  pickets: Picket[];
}
