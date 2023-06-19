## Installation

```bash
$ npm install @goodandco/nest-health
```
## Using

Health Module consists of controller for health check and specific configuration setup.

If you use yaml config module from `@goodnadco/nest-config` the configuration file for using this module
should look like this one:

```yaml
x-kafka-brokers: &KafkaBrokers
  - 'localhost:29092'

x-kafka-consumer-options: &KafkaConsumerOptions
  client:
    clientId: 'my-kafka-client'
    brokers: *KafkaBrokers
  consumer:
    groupId: 'my-kafka-consumer-group'


app:
  healthcheck:
    memoryHeap:
      key: 'memory_heap'
      options:
        heapUsedTreshhold: 209715200 # 200 * 1024 * 1024
        memoryRSS:
          key: 'memory_rss'
          options:
            rssTreshhold: 3145728000 # 3000 * 1024 * 1024
    microservices:
      - key: 'main kafka consumer'
        options:
          transport: 6
          options:
            client:
              clientId: 'health-consumer'
              brokers: *KafkaBrokers
            consumer:
              groupId: 'health-consumer'
            producerOnlyMode: true
    dbs:
      - key: 'mongodb'
        options:
          timeout: 300
```

For kafka, it needs to specify transport for kafka which is specifed in constant `Transport.KAFKA`.
Also the `producerOnlyMode` flag should be turned on.

In case of using yaml configuration loader your configuration will look like:

```typescript
import { HealthModule, THealthControllerOptions } from '@goodandco/health';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ...
    ConfigModule.forRoot({ 
      load: ConfigLoader.load<TConfig>(),
      isGlobal: true,
    }),
    HealthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<THealthControllerOptions>('app.healthcheck'),
    }),
    ...
```

The simple configuration with `forRoot` method:

```typescript
@Module({
  imports: [
    ...
    HealthModule.forRoot({ 
      memoryHeap: {
        key: 'memory_heap',
        options: {
          heapUsedTreshhold: 209715200
        }
      }, 
      memoryRSS: {
        key: 'memory_rss',
        options: {
          rssTreshhold: 209715200
        }
      },
      dbs: [
        {
          key: 'mongodb',
          options: {
            timeout: 300
          }
        }
      ],
      microservices: [
        {
          key: 'main kafka consumer',
          options: {
            transport: Transport.KAFKA,
            options: {
              producerOnlyMode: true,
              client: {
                clientId: 'health-consumer',
                brokers: ['localhost:29092']
              },
              consumer: {
                 groupId: 'health-consumer'
              }
            }
          }
        }
      ]
    }),
    ...
```

Go to ```http://localhost:<PORT>/health``` and there should be:
```json
{
  "status": "ok",
  "info": {
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    },
    "mongodb": {
      "status": "up"
    },
    "kafka": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    },
    "mongodb": {
      "status": "up"
    },
    "kafka": {
      "status": "up"
    }
  }
}
```
