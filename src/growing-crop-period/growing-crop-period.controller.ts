import {
  Controller,
  ValidationPipe,
  Body,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Get,
  Patch,
} from "@nestjs/common";
import { CreateGrowingCropPeriodDto } from "./dtos/create-growing-crop-period.dto";
import { UpdateGrowingCropPeriodDto } from "./dtos/update-growingCropPeriod.dto";
import { GrowingCropPeriodService } from "./growing-crop-period.service";
import { GrowingCropPeriod } from "./growing-crop-period.entity";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("growingCropPeriod")
@UseGuards(RolesGuard)
export class GrowingCropPeriodController {
  constructor(private growingCropPeriodService: GrowingCropPeriodService) {}

  @Get()
  async getAllFields() {
    const growingCropPeriods = await this.growingCropPeriodService.findAll();
    return { data: growingCropPeriods };
  }

  @Get(":id")
  async getFieldById(@Param("id", ParseUUIDPipe) id: string) {
    const growingCropPeriod =
      await this.growingCropPeriodService.findOneById(id);
    return { data: growingCropPeriod };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post()
  async createGrowingCropPeriod(
    @Body(ValidationPipe)
    createGrowingCropPeriodDto: CreateGrowingCropPeriodDto,
  ): Promise<GrowingCropPeriod> {
    return this.growingCropPeriodService.create(createGrowingCropPeriodDto);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch("/:id")
  async updateGrowingCropPeriod(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateGrowingCropPeriodDto: UpdateGrowingCropPeriodDto,
  ) {
    const updateGrowingCropPeriod = await this.growingCropPeriodService.update(
      id,
      updateGrowingCropPeriodDto,
    );
    return { data: updateGrowingCropPeriod };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; message: string }> {
    return this.growingCropPeriodService.softDelete(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteGrowingCropPeriodForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; message: string }> {
    return this.growingCropPeriodService.permanentDelete(id);
  }
}
