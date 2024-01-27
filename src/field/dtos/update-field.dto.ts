import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateFieldDto } from "./create-field.dto";

export class UpdateFieldDto extends PartialType(
  OmitType(CreateFieldDto, ["farmId"] as const),
) {}
