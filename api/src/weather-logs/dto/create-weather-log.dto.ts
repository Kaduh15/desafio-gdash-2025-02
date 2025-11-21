import { IsNumber, IsString } from 'class-validator';

export class CreateWeatherLogDto {
  @IsString()
  readonly time: string;
  @IsNumber()
  readonly temperature: number;
  @IsNumber()
  readonly humidity: number;
  @IsNumber()
  readonly wind_speed: number;
  @IsNumber()
  readonly weather_code: number;
  @IsNumber()
  readonly pressure: number;
  @IsNumber()
  readonly precipitation_probability: number;
  @IsNumber()
  readonly elevation: number;
  @IsNumber()
  readonly latitude: number;
  @IsNumber()
  readonly longitude: number;
  @IsString()
  readonly city: string;
}
