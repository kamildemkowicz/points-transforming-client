import { SingleLineDto } from './single-line-dto.model';

export class GeodeticObjectDto {
  id: number;
  name: string;
  description: string;
  symbol: string;
  color: string;
  singleLines: SingleLineDto[];
}
