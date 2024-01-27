import { PartialType } from "@nestjs/swagger";
import { CreateGrowingCropPeriodDto } from "./create-growing-crop-period.dto";

export class UpdateGrowingCropPeriodDto extends PartialType(
  CreateGrowingCropPeriodDto,
) {}
