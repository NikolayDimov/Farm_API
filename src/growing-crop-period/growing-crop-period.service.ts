import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { GrowingCropPeriod } from "./growing-crop-period.entity";
import { CreateGrowingCropPeriodDto } from "./dtos/create-growing-crop-period.dto";
import { FieldService } from "src/field/field.service";
import { CropService } from "src/crop/crop.service";
import { UpdateGrowingCropPeriodDto } from "./dtos/update-growingCropPeriod.dto";

@Injectable()
export class GrowingCropPeriodService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(GrowingCropPeriod)
    private growingCropPeriodRepository: Repository<GrowingCropPeriod>,
    private readonly fieldService: FieldService,
    private readonly cropService: CropService,
  ) {}

  async findAll() {
    const farms = await this.growingCropPeriodRepository.find({});
    if (!farms) {
      throw new NotFoundException(`No farms found`);
    }
    return farms;
  }

  async findOneById(id: string): Promise<GrowingCropPeriod> {
    const existingFarm = await this.growingCropPeriodRepository.findOneBy({
      id,
    });
    return existingFarm;
  }

  async create(
    createGrowingCropPeriodDto?: Partial<CreateGrowingCropPeriodDto>,
  ): Promise<GrowingCropPeriod> {
    createGrowingCropPeriodDto = createGrowingCropPeriodDto || {};

    const { fieldId, cropId } = createGrowingCropPeriodDto;

    const field = await this.fieldService.findOneById(fieldId);
    if (!field) {
      throw new BadRequestException(`No field found!`);
    }

    const crop = await this.cropService.findOneById(cropId);
    if (!crop) {
      throw new BadRequestException(`No crop found!`);
    }

    const newGrowingCropPeriod = this.growingCropPeriodRepository.create({
      fieldId: fieldId,
      cropId: cropId,
    });

    return await this.growingCropPeriodRepository.save(newGrowingCropPeriod);
  }

  async update(
    id: string,
    updateGrowingCropPeriodDto: UpdateGrowingCropPeriodDto,
  ): Promise<GrowingCropPeriod> {
    const existingGrowingCropPeriod =
      await this.growingCropPeriodRepository.findOneBy({ id });
    if (!existingGrowingCropPeriod) {
      throw new NotFoundException(`GrowingCropPeriod with id ${id} not found`);
    }

    const updatedGrowingCropPeriod: Partial<GrowingCropPeriod> = {};
    if (updateGrowingCropPeriodDto.fieldId) {
      updatedGrowingCropPeriod.fieldId = updateGrowingCropPeriodDto.fieldId;
    }
    if (updateGrowingCropPeriodDto.cropId) {
      updatedGrowingCropPeriod.cropId = updateGrowingCropPeriodDto.cropId;
    }

    await this.growingCropPeriodRepository.update(id, updatedGrowingCropPeriod);

    const updatedEntity = await this.growingCropPeriodRepository.findOneBy({
      id,
    });

    if (!updatedEntity) {
      throw new NotFoundException(
        `Updated GrowingCrooPeriod with ID ${id} not found`,
      );
    }

    return updatedEntity;
  }

  async softDelete(id: string): Promise<{
    id: string;
    message: string;
  }> {
    const existingGrowingPeriod =
      await this.growingCropPeriodRepository.findOneBy({ id });

    if (!existingGrowingPeriod) {
      throw new NotFoundException(`Growing Period with id ${id} not found`);
    }

    await this.growingCropPeriodRepository.softDelete({ id });

    return {
      id,
      message: `${id}`,
    };
  }

  async permanentDelete(id: string): Promise<{ id: string; message: string }> {
    const existingGrowingPeriod =
      await this.growingCropPeriodRepository.findOneBy({ id });

    if (!existingGrowingPeriod) {
      throw new NotFoundException(`GrowingPeriod with id ${id} not found`);
    }

    await this.growingCropPeriodRepository.remove(existingGrowingPeriod);

    return {
      id,
      message: `${id}`,
    };
  }
}
