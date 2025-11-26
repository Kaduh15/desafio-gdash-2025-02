import { Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Weather } from './schema/weathers.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private readonly weatherModel: Model<Weather>,
  ) {}

  create(createWeatherDto: CreateWeatherDto) {
    return this.weatherModel.create(createWeatherDto);
  }

  findAll() {
    return this.weatherModel.find().exec();
  }
}
