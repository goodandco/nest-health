import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HEALTH_CONTROLLER_OPTIONS } from './health.constants';
import { THealthControllerOptions } from './health.types';
import { HealthIndicatorFunction } from '@nestjs/terminus/dist/health-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    @Inject(HEALTH_CONTROLLER_OPTIONS)
    private readonly pingCheckOptions: THealthControllerOptions,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const {
      memoryHeap,
      memoryRSS,
      dbs = [],
      microservices = [],
    } = this.pingCheckOptions;

    const checkList: Array<HealthIndicatorFunction> = [];

    if (memoryHeap) {
      checkList.push(async () =>
        memoryHeap.pingCheck
          ? memoryHeap.pingCheck(memoryHeap.key, memoryHeap.options)
          : this.memory.checkHeap(
              memoryHeap.key,
              memoryHeap.options.heapUsedTreshhold,
            ),
      );
    }

    if (memoryRSS) {
      checkList.push(async () =>
        memoryRSS.pingCheck
          ? memoryRSS.pingCheck(memoryRSS.key, memoryRSS.options)
          : this.memory.checkRSS(memoryRSS.key, memoryRSS.options.rssTreshhold),
      );
    }

    for (const db of dbs) {
      checkList.push(async () =>
        db.pingCheck
          ? db.pingCheck(db.key, db.options)
          : this.db.pingCheck(db.key, db.options),
      );
    }

    for (const ms of microservices) {
      checkList.push(async () =>
        ms.pingCheck
          ? ms.pingCheck(ms.key, ms.options)
          : this.microservice.pingCheck(ms.key, ms.options),
      );
    }

    return this.health.check(checkList);
  }
}
