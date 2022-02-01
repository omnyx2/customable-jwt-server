import { Controller, Get } from '@nestjs/common';
import { 
    HealthCheckService, 
    HttpHealthIndicator, 
    HealthCheck,
    TypeOrmHealthIndicator
} from '@nestjs/terminus';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('customable-jwt-server', 'http://localhost:3000'),
      () => this.db.pingCheck('database'),
    ]);
  }
}