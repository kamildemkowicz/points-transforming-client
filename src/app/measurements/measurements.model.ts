import { Picket } from './pickets/picket.model';

export class MeasurementsModel {
  id: number;
  name: string;
  creationDate: string;
  place: string;
  owner: string;
  pickets: Picket[];
}
