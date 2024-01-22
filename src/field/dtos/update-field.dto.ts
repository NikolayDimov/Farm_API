import { OmitType, PartialType } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsObject,
  IsUUID,
  IsOptional,
} from "class-validator";
import { MultiPolygon, Polygon } from "geojson";
import { CreateFieldDto } from "./create-field.dto";

export class UpdateFieldDto extends PartialType(
  OmitType(CreateFieldDto, ["farmId"] as const),
) {}

//export class UpdateFieldDto{
// @IsNotEmpty({ message: "Name cannot be empty" })
// @IsString({ message: "Name must be a string" })
// @Matches(/^[A-Za-z0-9\s\-]+$/, {
//   message: "Name must contain only letters and numbers",
// })
// @IsOptional()
// name: string;

// @IsNotEmpty({ message: "Polygons cannot be empty" })
// @IsObject({ message: "Polygons must be a valid GeoJSON object" })
// @IsOptional()
// boundary: MultiPolygon | Polygon;

// @IsNotEmpty({ message: "SoilId cannot be empty" })
// @IsUUID("4", { message: "Invalid SoilId" })
// @IsOptional()
// soilId: string;

// @IsNotEmpty({ message: "FarmId cannot be empty" })
// @IsUUID("4", { message: "Invalid FarmId" })
// @IsOptional()
// farmId: string;
//}
