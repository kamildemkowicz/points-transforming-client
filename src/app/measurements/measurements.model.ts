import { Picket } from './pickets/picket.model';

export class MeasurementsModel {
  measurementInternalId: string;
  name: string;
  creationDate: string;
  place: string;
  owner: string;
  pickets: Picket[];
}
