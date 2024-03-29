import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";

import { FieldService } from "./field.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { UpdateFieldDto } from "./dtos/update-field.dto";

@Controller("field")
@UseGuards(RolesGuard)
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Get()
  async getAllFields() {
    const fields = await this.fieldService.findAll();
    return { data: fields };
  }

  @Get(":id")
  async getFieldById(@Param("id", ParseUUIDPipe) id: string) {
    const field = await this.fieldService.findOneById(id);
    return { data: field };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post()
  async createFieldWithSoilId(@Body() createFieldDto: CreateFieldDto) {
    const createdField = await this.fieldService.create(createFieldDto);
    return { data: createdField };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch("/:id")
  async updateField(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    const updatedField = await this.fieldService.update(id, updateFieldDto);
    return { data: updatedField };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.fieldService.softDelete(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteFieldByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.fieldService.permanentDelete(id);
  }
}
