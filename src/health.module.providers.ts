import { Provider } from '@nestjs/common';
import { HEALTH_CONTROLLER_OPTIONS } from './health.constants';
import {
  THealthCheckModuleOptions,
  THealthControllerOptions,
} from './health.types';

function defaultUseFactory(): THealthControllerOptions {
  return {
    memoryHeap: {
      key: 'memory_heap',
      options: {
        heapUsedTreshhold: 200 * 1024 * 1024,
      },
    },
    memoryRSS: {
      key: 'memory_rss',
      options: {
        rssTreshhold: 3000 * 1024 * 1024,
      },
    },
  };
}

export function createHealthProviders(
  options: THealthControllerOptions,
): Array<Provider> {
  return [
    {
      provide: HEALTH_CONTROLLER_OPTIONS,
      useValue: options,
    },
  ];
}

export function createHealthAsyncProviders(
  options: THealthCheckModuleOptions,
): Array<Provider> {
  return [
    {
      provide: HEALTH_CONTROLLER_OPTIONS,
      useFactory: options.useFactory || defaultUseFactory,
      inject: options.inject || [],
    },
  ];
}
