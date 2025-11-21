import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { WeatherLogsService } from './weather-logs.service';

@Controller('weather-logs')
export class WeatherLogsController {
  constructor(private readonly weatherLogsService: WeatherLogsService) {}

  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            temperature: { type: 'number' },
            humidity: { type: 'number' },
            windSpeed: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    content: {
      'application/json': {
        example: {
          message: 'This action adds a new weatherLog',
          data: {
            temperature: 25,
            humidity: 80,
            windSpeed: 10,
            timestamp: '2023-10-01T12:00:00Z',
          },
        },
      },
    },
  })
  @Post('/webhook')
  create(@Body() createWeatherLogDto: CreateWeatherLogDto) {
    return this.weatherLogsService.create(createWeatherLogDto);
  }
}
