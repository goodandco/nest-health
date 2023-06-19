import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  createHealthAsyncProviders,
  createHealthProviders,
} from './health.module.providers';
import {
  createHealthAsyncControllers,
  createHealthControllers,
} from './health.module.controllers';
import {
  THealthCheckModuleOptions,
  THealthControllerOptions,
} from './health.types';
import {
  createHealthAsyncImports,
  createHealthImports,
} from './health.module.imports';

@Global()
@Module({})
export class HealthModule {
  public static forRoot(options: THealthControllerOptions): DynamicModule {
    const imports = createHealthImports();
    const controllers = createHealthControllers();
    const providers = createHealthProviders(options);

    return {
      module: HealthModule,
      controllers,
      imports,
      providers,
    } as DynamicModule;
  }

  public static forRootAsync(
    options: THealthCheckModuleOptions,
  ): DynamicModule {
    const imports = createHealthAsyncImports(options);
    const controllers = createHealthAsyncControllers(options);
    const providers = createHealthAsyncProviders(options);

    return {
      module: HealthModule,
      controllers,
      imports,
      providers,
    } as DynamicModule;
  }
}
