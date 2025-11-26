import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Metadata extends Document {
  @Prop({
    required: true,
    type: Date,
  })
  collected_at: Date;

  @Prop({
    required: true,
    type: String,
  })
  provider: string;
}

@Schema()
class Location extends Document {
  @Prop({
    required: true,
    type: String,
  })
  city: string;

  @Prop({
    required: true,
    type: String,
  })
  country: string;

  @Prop({
    required: true,
    type: Number,
  })
  lat: number;

  @Prop({
    required: true,
    type: Number,
  })
  lon: number;
}

@Schema()
class CurrentWeather extends Document {
  @Prop({
    required: true,
    type: String,
  })
  timestamp: string;

  @Prop({
    required: true,
    type: Number,
  })
  temperature_c: number;

  @Prop({
    required: true,
    type: Number,
  })
  feels_like_c: number;

  @Prop({
    required: true,
    type: Number,
  })
  humidity_pct: number;

  @Prop({
    required: true,
    type: Number,
  })
  wind_kmh: number;

  @Prop({
    required: true,
    type: String,
  })
  condition: string;
}

@Schema()
class ForecastHour extends Document {
  @Prop({
    required: true,
    type: String,
  })
  timestamp: string;

  @Prop({
    required: true,
    type: Number,
  })
  temperature_c: number;

  @Prop({
    required: true,
    type: Number,
  })
  humidity_pct: number;

  @Prop({
    required: true,
    type: Number,
  })
  wind_kmh: number;

  @Prop({
    required: true,
    type: String,
  })
  condition: string;

  @Prop({
    required: true,
    type: Number,
  })
  rain_probability_pct: number;
}

@Schema()
export class Weather extends Document {
  @Prop({
    required: true,
    type: Metadata,
  })
  metadata: Metadata;

  @Prop({
    required: true,
    type: Location,
  })
  location: Location;

  @Prop({
    required: true,
    type: CurrentWeather,
  })
  current: CurrentWeather;

  @Prop({
    required: true,
    type: [ForecastHour],
  })
  forecast_hours: ForecastHour[];
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
