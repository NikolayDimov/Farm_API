// ReportController

import { Controller, Get, UseGuards } from "@nestjs/common";
import { FarmService } from "../farm/farm.service";
import { ProcessingService } from "../processing/processing.service";
import { FieldService } from "../field/field.service";
import { GrowingCropPeriodService } from "../growing-crop-period/growing-crop-period.service";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("report")
@UseGuards(AuthGuard)
export class ReportController {
  constructor(
    private readonly farmService: FarmService,
    private readonly processingService: ProcessingService,
    private readonly fieldService: FieldService,
  ) {}

  @Get("/farms-with-most-machines")
  async getFarmsWithMostMachines() {
    return this.farmService.getFarmsWithMostMachines();
  }

  @Get("/field-count-per-farm-and-crop")
  async generateFieldsPerFarmAndCropReport() {
    const fieldsPerFarmAndCrop =
      await this.fieldService.getFieldsPerFarmAndCrop();
    return fieldsPerFarmAndCrop;
  }

  @Get("/most-common-soil-per-farm")
  async getMostCommonSoilPerFarm() {
    const result = await this.fieldService.getMostCommonSoilPerFarm();
    return result;
  }

  @Get("/processing-report")
  async generateProcessingReport() {
    try {
      return await this.processingService.generateProcessingReport();
    } catch (error) {
      console.error("Error generating processing report:", error);
      throw new Error("Failed to generate processing report");
    }
  }
}
