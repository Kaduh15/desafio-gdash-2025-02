import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
  Min,
  Max,
  IsNotEmptyObject,
} from 'class-validator';

class MetadataDto {
  @IsDateString()
  collected_at: Date;

  @IsString()
  provider: string;
}

class LocationDto {
  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;
}

class CurrentWeatherDto {
  @IsDateString()
  timestamp: string;

  @IsNumber()
  temperature_c: number;

  @IsNumber()
  feels_like_c: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  humidity_pct: number;

  @IsNumber()
  @Min(0)
  wind_kmh: number;

  @IsString()
  condition: string;
}

class ForecastHourDto {
  @IsDateString()
  timestamp: string;

  @IsNumber()
  temperature_c: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  humidity_pct: number;

  @IsNumber()
  @Min(0)
  wind_kmh: number;

  @IsString()
  condition: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rain_probability_pct: number;
}

export class CreateWeatherDto {
  @ValidateNested()
  @Type(() => MetadataDto)
  @IsNotEmptyObject()
  metadata: MetadataDto;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmptyObject()
  location: LocationDto;

  @ValidateNested()
  @Type(() => CurrentWeatherDto)
  @IsNotEmptyObject()
  current: CurrentWeatherDto;

  @ValidateNested({ each: true })
  @Type(() => ForecastHourDto)
  @IsArray()
  forecast_hours: ForecastHourDto[];
}
