import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateMachineDto } from "./create-machine.dto";

export class UpdateMachineDto extends PartialType(
  OmitType(CreateMachineDto, ["farmId"] as const),
) {}
