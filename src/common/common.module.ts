// common.module.ts o utils.module.ts
import { Module } from '@nestjs/common';
import { DynamicQueryService } from './dynamic-query.service';

@Module({
  providers: [DynamicQueryService],
  exports: [DynamicQueryService], // <-- NECESARIO
})
export class CommonModule {}
