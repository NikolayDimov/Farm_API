import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GrowingCropPeriodController } from "./growing-crop-period.controller";
import { GrowingCropPeriodService } from "./growing-crop-period.service";
import { GrowingCropPeriod } from "./growing-crop-period.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GrowingCropPeriod])],
  controllers: [GrowingCropPeriodController],
  providers: [GrowingCropPeriodService],
  exports: [GrowingCropPeriodService],
})
export class GrowingCropPeriodModule {}
