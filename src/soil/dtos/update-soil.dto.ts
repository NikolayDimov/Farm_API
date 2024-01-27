import { PartialType } from "@nestjs/swagger";
import { CreateSoilDto } from "./create-soil.dto";

export class UpdateSoilDto extends PartialType(CreateSoilDto) {}
