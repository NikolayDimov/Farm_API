import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { GrowingCropPeriod } from "./growing-crop-period.entity";
import { CreateGrowingCropPeriodDto } from "./dtos/create-growing-crop-period.dto";

@Injectable()
export class GrowingCropPeriodService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(GrowingCropPeriod)
    private growingCropPeriodRepository: Repository<GrowingCropPeriod>,
  ) {}

  async findOneById(id: string): Promise<GrowingCropPeriod> {
    const existinggrowingCropPeriod =
      await this.growingCropPeriodRepository.findOneBy({
        id,
      });
    return existinggrowingCropPeriod;
  }

  async create(
    createGrowingCropPeriodDto?: Partial<CreateGrowingCropPeriodDto>,
  ): Promise<GrowingCropPeriod> {
    createGrowingCropPeriodDto = createGrowingCropPeriodDto || {};

    const { fieldId, cropId } = createGrowingCropPeriodDto;

    // const field = await this.fieldService.findOneById(fieldId);
    // if (!field) {
    //   throw new BadRequestException(`No field found!`);
    // }

    // const crop = await this.cropService.findOneById(cropId);
    // if (!crop) {
    //   throw new BadRequestException(`No crop found!`);
    // }

    const newGrowingCropPeriod = this.growingCropPeriodRepository.create({
      field_id: fieldId,
      crop_id: cropId,
    });

    return await this.growingCropPeriodRepository.save(newGrowingCropPeriod);
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

    // const isGrowingCropperiodAssociatedWithProcessings =
    //   await this.processingService.isGrowingCropperiodAssociatedWithProcessings(
    //     id,
    //   );

    // if (isGrowingCropperiodAssociatedWithProcessings) {
    //   throw new BadRequestException(
    //     `This growingCropperiod with ID ${id} has associated Processing. Cannot delete the growingCropPeriod.`,
    //   );
    // }

    // Soft delete using the softDelete method
    await this.growingCropPeriodRepository.softDelete({ id });

    return {
      id,
      message: `Successfully soft deleted Growing period with id ${id}`,
    };
  }

  async permanentDelete(id: string): Promise<{ id: string; message: string }> {
    const existingGrowingPeriod =
      await this.growingCropPeriodRepository.findOneBy({ id });

    if (!existingGrowingPeriod) {
      throw new NotFoundException(`GrowingPeriod with id ${id} not found`);
    }

    // const isGrowingCropperiodAssociatedWithProcessings =
    //   await this.processingService.isGrowingCropperiodAssociatedWithProcessings(
    //     id,
    //   );

    // if (isGrowingCropperiodAssociatedWithProcessings) {
    //   throw new BadRequestException(
    //     `This growingCropperiod with ID ${id} has associated Processing. Cannot delete the growingCropPeriod.`,
    //   );
    // }

    // Perform the permanent delete
    await this.growingCropPeriodRepository.remove(existingGrowingPeriod);

    return {
      id,
      message: `Successfully permanently deleted growingCropPeriod with id ${id}`,
    };
  }
}
