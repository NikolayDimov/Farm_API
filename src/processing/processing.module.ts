import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProcessingController } from "./processing.controller";
import { Processing } from "./processing.entity";
import { ProcessingService } from "./processing.service";
import { GrowingCropPeriodModule } from "src/growing-crop-period/growing-crop-period.module";
import { ProcessingTypeModule } from "src/processing-type/processing-type.module";
import { MachineModule } from "src/machine/machine.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Processing]),
    GrowingCropPeriodModule,
    ProcessingTypeModule,
    MachineModule,
  ],
  controllers: [ProcessingController],
  providers: [ProcessingService],
  exports: [ProcessingService],
})
export class ProcessingModule {}
