// server2/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalyzeModule } from './analyze/analyze/analyze.module'; // 경로 확인

@Module({
  imports: [AnalyzeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}