// server2/src/analyze/analyze.module.ts
import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';

@Module({
  controllers: [AnalyzeController],
})
export class AnalyzeModule {}