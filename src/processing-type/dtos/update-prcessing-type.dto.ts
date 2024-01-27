import { PartialType } from "@nestjs/swagger";
import { CreateProcessingTypeDto } from "./create-processing-type.dto";

export class UpdateProcessingTypeDto extends PartialType(
  CreateProcessingTypeDto,
) {}
