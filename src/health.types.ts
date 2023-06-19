import { TypeOrmPingCheckSettings } from '@nestjs/terminus';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { PropType } from '@nestjs/terminus/dist/utils';
import { HealthIndicatorResult } from '@nestjs/terminus/dist/health-indicator';

type THealthCheckComponentOptions<TOptions = any> = {
  key: string;
  options: TOptions;
  pingCheck?: (
    key: string,
    options: TOptions,
  ) => Promise<HealthIndicatorResult>;
};

type TMemoryHeapOptions = {
  heapUsedTreshhold: number;
};

type TMemoryRSSOptions = {
  rssTreshhold: number;
};

interface MicroserviceOptionsLike {
  transport?: number;
  options?: Record<string, any>;
}

type MicroserviceHealthIndicatorOptions<
  T extends MicroserviceOptionsLike = MicroserviceOptionsLike,
> = {
  transport: Required<PropType<MicroserviceOptionsLike, 'transport'>>;
  timeout?: number;
} & Partial<T>;

export type THealthControllerOptions = {
  microservices?: Array<
    THealthCheckComponentOptions<MicroserviceHealthIndicatorOptions>
  >;
  dbs?: Array<THealthCheckComponentOptions<TypeOrmPingCheckSettings>>;
  memoryHeap?: THealthCheckComponentOptions<TMemoryHeapOptions>;
  memoryRSS?: THealthCheckComponentOptions<TMemoryRSSOptions>;
};

export type THealthCheckModuleOptions = {
  imports?:
    | Array<any>
    | Array<DynamicModule | Promise<DynamicModule> | ForwardReference>;
  useFactory?: (
    ...args: Array<any>
  ) => Promise<THealthControllerOptions> | THealthControllerOptions;
  inject?: Array<any>;
  controllers?: Array<any>;
};
