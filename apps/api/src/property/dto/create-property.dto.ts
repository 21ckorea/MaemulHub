import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export enum PropertyTypeDto {
  apartment = 'apartment',
  officetel = 'officetel',
  store = 'store',
  land = 'land',
  multifamily = 'multifamily',
  villa = 'villa',
}

export enum DealTypeDto {
  sale = 'sale',
  jeonse = 'jeonse',
  monthly = 'monthly',
  lease = 'lease',
  rent = 'rent',
}

export enum PropertyStatusDto {
  draft = 'draft',
  review = 'review',
  published = 'published',
  in_contract = 'in_contract',
  closed = 'closed',
}

export class CreatePropertyDto {
  @IsEnum(PropertyTypeDto)
  type!: PropertyTypeDto;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @IsOptional()
  @IsString()
  complex_name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area_supply?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area_exclusive?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(-5)
  @Max(200)
  floor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  rooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  baths?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2099)
  built_year?: number;

  @IsOptional()
  @IsString()
  parking?: string;

  @IsOptional()
  @IsEnum(DealTypeDto)
  deal_type?: DealTypeDto;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deposit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rent?: number;

  @IsOptional()
  @IsDateString()
  available_from?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maintenance_fee?: number;

  @IsOptional()
  @IsEnum(PropertyStatusDto)
  status?: PropertyStatusDto;

  @IsOptional()
  @IsString()
  assignee?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  photos?: string[];
}
