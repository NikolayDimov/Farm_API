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

@Injectable()
export class ProcessingService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Processing)
    private processingRepository: Repository<Processing>,
  ) {}

  async findAll() {
    const processing = await this.processingRepository.find({});
    if (!processing) {
      throw new NotFoundException(`No processingType found`);
    }
    return processing;
  }

  async findOneById(id: string): Promise<Processing> {
    const existingProcessing = await this.processingRepository.findOneBy({
      id,
    });
    return existingProcessing;
  }

  async create(createProcessingDto: CreateProcessingDto): Promise<Processing> {
    const { date, processingTypeId, machineId, growingCropPeriodId } =
      createProcessingDto;

    const growingPeriodFarmId = await this.entityManager
      .getRepository(GrowingCropPeriod)
      .createQueryBuilder("gp")
      .innerJoin("field", "f", "f.id = gp.fieldId")
      .where("gp.id = :growingPeriodId", { growingCropPeriodId })
      .select("f.farmId", "farmId")
      .getRawOne();

    const machineFarmId = await this.entityManager
      .getRepository(Machine)
      .createQueryBuilder("machine")
      .where("machine.id = :machineId", { machineId })
      .select("machine.farmId", "farmId")
      .getRawOne();

    if (machineFarmId.farmId !== growingPeriodFarmId.farmId) {
      throw new BadRequestException(
        `Machine with id ${machineId} is not in this farm. Please select another machine`,
      );
    }

    // const growingCropPeriod =
    //   await this.growingCropPeriodService.findOneById(growingCropPeriodId);
    // if (!growingCropPeriod) {
    //   throw new BadRequestException(`There is no growingCropPeriod`);
    // }

    // const processingType =
    //   await this.processingTypeService.findOneById(processingTypeId);
    // if (!processingType) {
    //   throw new BadRequestException(`There is no processingType`);
    // }

    // const machine = await this.machineService.findOneById(machineId);
    // if (!machine) {
    //   throw new BadRequestException(`There is no machine type`);
    // }

    // const fieldObj = await this.fieldService.findOneById(
    //   growingCropPeriod.field_id,
    // );
    // if (!fieldObj) {
    //   throw new BadRequestException(`There is no fieldFarm!`);
    // }
    // const fieldFarmId = fieldObj.farm_id;

    // const machineObj = await this.machineService.findOneById(machine.farm_id);
    // if (!machineObj) {
    //   throw new BadRequestException(`There is no machineFarm!`);
    // }
    // const machineFarmId = machineObj.farm_id;

    // if (fieldFarmId !== machineFarmId) {
    //   throw new BadRequestException(
    //     `The machine ${machineObj.brand} ${machineObj.model} ${machineObj.registerNumber} not belong to farm ${fieldObj.farm_id}`,
    //   );
    // }

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

    if (updateProcessingDto.date) {
      existingProcessing.date = updateProcessingDto.date;
    }

    // const fieldFarm = await this.fieldService.findOneById(
    //   updateProcessingDto.growingCropPeriodId,
    // );
    // if (!fieldFarm) {
    //   throw new BadRequestException(`There is no fieldFarm!`);
    // }
    // const fieldFarmId = fieldFarm.farm_id;

    // const machineFarm = await this.machineService.findOneById(
    //   updateProcessingDto.machineId,
    // );
    // if (!machineFarm) {
    //   throw new BadRequestException(`There is no machineFarm!`);
    // }
    // const machineFarmId = machineFarm.farm_id;

    // if (fieldFarmId !== machineFarmId) {
    //   throw new BadRequestException(
    //     `The machine ${machineFarm.brand} ${machineFarm.model} ${machineFarm.registerNumber} not belong to farm ${fieldFarm.farm_id}`,
    //   );
    // }

    const updateResult = await this.processingRepository.update(
      id,
      updateProcessingDto,
    );

    // Check if the update was successful
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }

    // Fetch and return the updated field
    const updatedField = await this.processingRepository.findOneBy({ id });

    if (!updatedField) {
      throw new NotFoundException(`Updated field with ID ${id} not found`);
    }

    return updatedField;
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
      message: `Successfully soft deleted Processing with id ${id}`,
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
      message: `Successfully permanently deleted Processing with id ${id}`,
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
