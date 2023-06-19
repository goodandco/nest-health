import { Provider } from '@nestjs/common';
import { HealthController } from './health.controller';
import { THealthCheckModuleOptions } from './health.types';

export function createHealthControllers(): Array<Provider> {
  return [HealthController];
}

export function createHealthAsyncControllers(
  options: THealthCheckModuleOptions,
): Array<Provider> {
  return options.controllers || createHealthControllers();
}
