import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { lot } from 'src/db/schema/lot';

export type LotInsert = typeof lot.$inferInsert;
export type LotSelect = typeof lot.$inferSelect;

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
  withAvailability?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ownerId?: number;
}

export type LotEditableFields = Pick<LotInsert, 'address' | 'name'> & {
  location: Coordinates;
};

export type GetLotsFromSpotIdsDto = {
  lots: LotSelect[];
  spotsToLots: Record<number, number>;
};
