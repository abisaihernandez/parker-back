import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class Coordinates {
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  longitude: number;
}

export class Bounds {
  @Type(() => Coordinates)
  @ValidateNested()
  northEast: Coordinates;

  @Type(() => Coordinates)
  @ValidateNested()
  southWest: Coordinates;
}

export class GetLotsQueryDto {
  @IsObject()
  @IsOptional()
  @Type(() => Bounds)
  bounds?: Bounds;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  with_availability?: boolean;
}

export type LotEditableFields = {
  name: string;
  address: string;
  location: Coordinates;
};

export type LotPayload = {
  id: number;
  name: string;
  address: string;
  location: {
    x: number;
    y: number;
  };
  ownerId: number | null;
};

export type GetLotsFromSpotIdsDto = {
  lots: LotPayload[];
  spotsToLots: Record<number, number>;
};
