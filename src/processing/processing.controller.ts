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
import { CreateProcessingDto } from "./dtos/create-processing.dto";
import { UpdateProcessingDto } from "./dtos/update-processing.dto";
import { ProcessingService } from "./processing.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("processing")
@UseGuards(RolesGuard)
export class ProcessingController {
  constructor(private processingService: ProcessingService) {}

  @Get()
  async getAllProcessings() {
    const processing = await this.processingService.findAll();
    return { data: processing };
  }

  @Get(":id")
  async getProcessingById(@Param("id", ParseUUIDPipe) id: string) {
    const processings = await this.processingService.findOneById(id);
    return { data: processings };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post()
  async createProcessing(@Body() createProcessingDto: CreateProcessingDto) {
    const createdProcessing =
      await this.processingService.create(createProcessingDto);
    return { data: createdProcessing };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateField(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProcessingDto: UpdateProcessingDto,
  ) {
    const updatedProcessing = await this.processingService.update(
      id,
      updateProcessingDto,
    );
    return { data: updatedProcessing };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(@Param("id", ParseUUIDPipe) id: string): Promise<{
    id: string;
    date: Date;
    message: string;
  }> {
    return this.processingService.softDelete(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteProcessingForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{
    id: string;
    date: Date;
    message: string;
  }> {
    return this.processingService.permanentDelete(id);
  }
}
