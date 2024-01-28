import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateSoilDto } from "./dtos/create-soil.dto";
import { SoilService } from "./soil.service";
import { UpdateSoilDto } from "./dtos/update-soil.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("soil")
@UseGuards(RolesGuard)
export class SoilController {
  constructor(private soilService: SoilService) {}

  @Get()
  async getAllSoils() {
    const soils = await this.soilService.findAll();
    return { data: soils };
  }

  @Get(":id")
  async getSoilById(@Param("id", ParseUUIDPipe) id: string) {
    const soil = await this.soilService.findOneById(id);
    return { data: soil };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post()
  async createSoil(@Body() createSoilDto: CreateSoilDto) {
    const createdSoil = await this.soilService.create(createSoilDto);
    return { data: createdSoil };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateSoil(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateSoilDto: UpdateSoilDto,
  ) {
    const updatedSoil = await this.soilService.update(id, updateSoilDto);
    return { data: updatedSoil };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async softDetele(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.soilService.softDetele(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentDelete(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.soilService.permanentDelete(id);
  }
}
