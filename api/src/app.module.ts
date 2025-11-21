import { Module } from '@nestjs/common';
import { WeatherLogsModule } from './weather-logs/weather-logs.module';

@Module({
  imports: [WeatherLogsModule],
})
export class AppModule {}
