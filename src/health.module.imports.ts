import { TerminusModule } from '@nestjs/terminus';
import { THealthCheckModuleOptions } from './health.types';

export function createHealthImports(): Array<any> {
  return [TerminusModule];
}

export function createHealthAsyncImports(
  options: THealthCheckModuleOptions,
): Array<any> {
  const { imports = [] } = options;

  return [...imports, ...createHealthImports()];
}
