import { Injectable } from '@nestjs/common';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';

@Injectable()
export class WeatherLogsService {
  create(createWeatherLogDto: CreateWeatherLogDto) {
    console.log('Weather log created:', createWeatherLogDto);

    return {
      message: 'This action adds a new weatherLog',
      data: createWeatherLogDto,
    };
  }
}
