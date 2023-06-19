import { Test, TestingModule } from '@nestjs/testing';
import { HealthModule } from '../../src';
import * as request from 'supertest';

describe('Health Module', () => {
  it('boots with default params successfully', async () => {
    // Arrange
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [HealthModule.forRoot({})],
    }).compile();
    // Act
    const app = testingModule.createNestApplication();
    await app.init();
    // Assert
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', info: {}, error: {}, details: {} });
  });
});
