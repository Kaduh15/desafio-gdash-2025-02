import { Module } from '@nestjs/common';
import { WeatherLogsService } from './weather-logs.service';
import { WeatherLogsController } from './weather-logs.controller';

@Module({
  controllers: [WeatherLogsController],
  providers: [WeatherLogsService],
})
export class WeatherLogsModule {}
