import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { Processing } from "./processing.entity";
import { CreateProcessingDto } from "./dtos/create-processing.dto";
import { UpdateProcessingDto } from "./dtos/update-processing.dto";
import { GrowingCropPeriod } from "../growing-crop-period/growing-crop-period.entity";
import { Machine } from "../machine/machine.entity";
import { GrowingCropPeriodService } from "src/growing-crop-period/growing-crop-period.service";
import { ProcessingTypeService } from "src/processing-type/processing-type.service";
import { MachineService } from "src/machine/machine.service";
import { validate } from "class-validator";

@Injectable()
export class ProcessingService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Processing)
    private processingRepository: Repository<Processing>,
    private readonly growingCropPeriodService: GrowingCropPeriodService,
    private readonly processingTypeService: ProcessingTypeService,
    private readonly machineService: MachineService,
  ) {}

  async findAll() {
    const processings = await this.processingRepository.find({});
    if (!processings) {
      throw new NotFoundException(`No processings found`);
    }
    return processings;
  }

  async findOneById(id: string): Promise<Processing> {
    const existingProcessing = await this.processingRepository.findOneBy({
      id,
    });
    if (!existingProcessing) {
      throw new NotFoundException(`No processing found`);
    }
    return existingProcessing;
  }

  async create(createProcessingDto: CreateProcessingDto): Promise<Processing> {
    const errors = await validate(createProcessingDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { date, growingCropPeriodId, processingTypeId, machineId } =
      createProcessingDto;

    const growingCropPeriodFarmId = await this.entityManager
      .getRepository(GrowingCropPeriod)
      .createQueryBuilder("gp")
      .innerJoin("field", "f", "f.id = gp.field_id")
      .where("gp.id = :growingCropPeriodId", { growingCropPeriodId })
      .select("f.farm_id", "farm_id")
      .getRawOne();

    const machineFarmId = await this.entityManager
      .getRepository(Machine)
      .createQueryBuilder("machine")
      .where("machine.id = :machineId", { machineId })
      .select("machine.farm_id", "farm_id")
      .getRawOne();

    if (
      !machineFarmId ||
      !machineFarmId.farm_id ||
      machineFarmId.farm_id !== growingCropPeriodFarmId?.farm_id
    ) {
      throw new BadRequestException(
        `Machine with id ${machineId} is not in this farm as field is.`,
      );
    }

    const newProcessing = this.processingRepository.create({
      date,
      growing_crop_period_id: growingCropPeriodId,
      processing_type_id: processingTypeId,
      machine_id: machineId,
    });

    const createdProcessing =
      await this.processingRepository.save(newProcessing);
    return createdProcessing;
  }

  async update(
    id: string,
    updateProcessingDto: UpdateProcessingDto,
  ): Promise<Processing> {
    const existingProcessing = await this.processingRepository.findOneBy({
      id,
    });

    if (!existingProcessing) {
      throw new NotFoundException(`Processing with ID ${id} not found`);
    }

    // Check if the date is provided in the update DTO
    if (updateProcessingDto.date) {
      existingProcessing.date = updateProcessingDto.date;
    }

    // Check if the machine ID is provided in the update DTO
    if (updateProcessingDto.machineId) {
      // Retrieve the farm ID of the machine
      const machineFarmId = await this.entityManager
        .getRepository(Machine)
        .createQueryBuilder("machine")
        .where("machine.id = :machineId", {
          machineId: updateProcessingDto.machineId,
        })
        .select("machine.farm_id", "farm_id")
        .getRawOne();

      // Check if the machine is in the same farm as the growing crop period's field
      const growingCropPeriodFarmId = await this.entityManager
        .getRepository(GrowingCropPeriod)
        .createQueryBuilder("gp")
        .innerJoin("field", "f", "f.id = gp.field_id")
        .where("gp.id = :growingCropPeriodId", {
          growingCropPeriodId: existingProcessing.growing_crop_period_id,
        })
        .select("f.farm_id", "farm_id")
        .getRawOne();

      if (
        !machineFarmId ||
        !machineFarmId.farm_id ||
        machineFarmId.farm_id !== growingCropPeriodFarmId?.farm_id
      ) {
        throw new BadRequestException(
          `Machine with id ${updateProcessingDto.machineId} is not in this farm as field is.`,
        );
      }

      // Update the machine ID
      existingProcessing.machine_id = updateProcessingDto.machineId;
    }

    // Set the updated properties in the processing entity
    Object.assign(existingProcessing, {
      growingCropPeriodId: updateProcessingDto.growingCropPeriodId,
    });

    // Save the updated processing entity
    await this.processingRepository.save(existingProcessing);

    return existingProcessing;
  }

  async softDelete(id: string): Promise<{
    id: string;
    date: Date;
    message: string;
  }> {
    const existingProcessing = await this.processingRepository.findOneBy({
      id,
    });

    if (!existingProcessing) {
      throw new NotFoundException(`Processing with id ${id} not found`);
    }

    await this.processingRepository.softDelete({ id });
    return {
      id,
      date: existingProcessing.deleted || new Date(),
      message: `${id}`,
    };
  }

  async permanentDelete(id: string): Promise<{
    id: string;
    date: Date;
    message: string;
  }> {
    const existingProcessing = await this.processingRepository.findOneBy({
      id,
    });

    if (!existingProcessing) {
      throw new NotFoundException(`Processing with id ${id} not found`);
    }

    await this.processingRepository.remove(existingProcessing);
    return {
      id,
      date: existingProcessing.deleted || new Date(), // Use deleted instead of date
      message: `${id}`,
    };
  }

  async generateProcessingReport(): Promise<ProcessingReportDTO[]> {
    const result: ProcessingReportDTO[] = await this.processingRepository
      .createQueryBuilder("processing")
      .select([
        "processing.date AS processingDate",
        "processingType.name AS processingTypeName",
        "field.name AS fieldName",
        "machine.brand AS machineBrand",
        "machine.model AS machineModel",
        "crop.name AS cropName",
        "soil.name AS soilName",
        "farm.name AS farmName",
      ])
      .leftJoin("processing.growingCropPeriod", "growingCropPeriod")
      .leftJoin("processing.processingType", "processingType")
      .leftJoin("growingCropPeriod.field", "field")
      .leftJoin("field.soil", "soil")
      .leftJoin("field.farm", "farm")
      .leftJoin("processing.machine", "machine")
      .leftJoin("growingCropPeriod.crop", "crop")
      .where("processing.deleted_at IS NULL")
      .orderBy("processing.date", "ASC")
      .getRawMany();

    return result;
  }

  async isGrowingCropperiodAssociatedWithProcessings(
    growingCropPeriodId: string,
  ): Promise<boolean> {
    const count = await this.processingRepository.count({
      where: { growing_crop_period_id: growingCropPeriodId },
    });

    return count > 0;
  }

  async isProcessingTypeAssociatedWithProcessings(
    processingTypeId: string,
  ): Promise<boolean> {
    const count = await this.processingRepository.count({
      where: { processing_type_id: processingTypeId },
    });

    return count > 0;
  }

  async isMachineAssociatedWithProcessings(
    machineId: string,
  ): Promise<boolean> {
    const count = await this.processingRepository.count({
      where: { machine_id: machineId },
    });

    return count > 0;
  }
}
