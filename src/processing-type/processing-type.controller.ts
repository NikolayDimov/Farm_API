import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Patch,
  NotFoundException,
} from "@nestjs/common";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ProcessingTypeService } from "./processing-type.service";
import { CreateProcessingTypeDto } from "./dtos/create-processing-type.dto";
import { UpdateProcessingTypeDto } from "./dtos/update-prcessing-type.dto";

@Controller("processingType")
@UseGuards(RolesGuard)
export class ProcessingTypeController {
  constructor(private processingTypeService: ProcessingTypeService) {}

  @Get()
  async getAllProcessingType() {
    const processingTypes = await this.processingTypeService.findAll();
    return { data: processingTypes };
  }

  @Get(":id")
  async getProcessingTypeById(@Param("id", ParseUUIDPipe) id: string) {
    const processingType = await this.processingTypeService.findOneById(id);
    return { data: processingType };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post()
  async createProcessing(
    @Body() createProcessingTypeDto: CreateProcessingTypeDto,
  ) {
    const createdProcessingType = await this.processingTypeService.create(
      createProcessingTypeDto,
    );
    return { data: createdProcessingType };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateProcessingType(
    @Param("id") id: string,
    @Body() updateProcessingTypeDto: UpdateProcessingTypeDto,
  ) {
    const updatedProcessingType = await this.processingTypeService.update(
      id,
      updateProcessingTypeDto,
    );
    return { data: updatedProcessingType };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteProcessingTypeById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    return this.processingTypeService.softDelete(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteProcessingTypeForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.processingTypeService.permanentDelete(id);
  }
}
