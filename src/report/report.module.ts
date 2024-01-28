import { Module } from "@nestjs/common";
import { ReportController } from "./report.controller";
import { FarmModule } from "../farm/farm.module";
import { ProcessingModule } from "src/processing/processing.module";
import { GrowingCropPeriodModule } from "src/growing-crop-period/growing-crop-period.module";
import { FieldModule } from "src/field/field.module";

@Module({
  imports: [FarmModule, ProcessingModule, GrowingCropPeriodModule, FieldModule],
  providers: [],
  controllers: [ReportController],
})
export class ReportModule {}
