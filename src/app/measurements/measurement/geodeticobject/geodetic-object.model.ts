import { SingleLine } from './single-line.model';

export class GeodeticObject {
  id: number;
  name: string;
  description: string;
  symbol: string;
  color: string;
  measurementInternalId: string;
  singleLines: SingleLine[];
}
