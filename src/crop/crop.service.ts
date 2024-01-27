import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { validate } from "class-validator";
import { Crop } from "./crop.entity";
import { CreateCropDto } from "./dtos/create-crop.dto";
import { UpdateCropDto } from "./dtos/update-crop.dto";
import { GrowingCropPeriod } from "src/growing-crop-period/growing-crop-period.entity";

@Injectable()
export class CropService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Crop) private cropRepository: Repository<Crop>,
  ) {}

  async findAll() {
    const crops = await this.cropRepository.find({});
    if (!crops) {
      throw new NotFoundException(`No crops found`);
    }
    return crops;
  }

  async findOneById(id: string): Promise<Crop> {
    const existingCropId = await this.cropRepository.findOneBy({ id });
    return existingCropId;
  }

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const errors = await validate(createCropDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name } = createCropDto;

    const existingCrop = await this.cropRepository.findOne({
      withDeleted: true,
      where: { name },
    });

    if (existingCrop) {
      // If the soil exists and is soft-deleted, restore it
      if (existingCrop.deleted) {
        existingCrop.deleted = null;
        return await this.cropRepository.save(existingCrop);
      } else {
        // If the soil is not soft-deleted, throw a conflict exception
        throw new ConflictException(`Crop ${name} already exists`);
      }
    }
    // const existingCrop = await this.cropRepository.findOne({
    //   where: { name },
    // });

    // if (createCropDto.name === existingCrop.name) {
    //   throw new BadRequestException(`Crop already exists!`);
    // }

    const newCrop = this.cropRepository.create({ name });
    const newCreatedCrop = await this.cropRepository.save(newCrop);
    return newCreatedCrop;
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const existingCrop = await this.cropRepository.findOneBy({ id });
    if (!existingCrop) {
      throw new NotFoundException(`Crop with ID ${id} not found`);
    }

    if (updateCropDto.name) {
      const existingCropWithSameName = await this.cropRepository.findOne({
        where: { name: updateCropDto.name },
      });

      if (existingCropWithSameName && existingCropWithSameName.id !== id) {
        throw new ConflictException(
          `Crop with name ${updateCropDto.name} already exists`,
        );
      }

      // Update the crop name
      await this.cropRepository.update(id, { name: updateCropDto.name });
    }

    const updatedCrop = await this.cropRepository.findOneBy({ id });
    if (!updatedCrop) {
      throw new NotFoundException(`Updated crop with ID ${id} not found`);
    }

    return updatedCrop;
  }

  async softDelete(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingCrop = await this.cropRepository.findOneBy({ id });

    if (!existingCrop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }

    const isCropAssociatedWithGrowingCropPeriod = await this.entityManager
      .getRepository(GrowingCropPeriod)
      .createQueryBuilder("growingCropperiod")
      .where("growingCropperiod.crop_id = :id", { id })
      .getCount();

    if (isCropAssociatedWithGrowingCropPeriod > 0) {
      throw new BadRequestException(
        `This crop with ID ${id} has associated growingCropPeriod. Cannot delete the crop.`,
      );
    }

    await this.cropRepository.softDelete({ id });

    return {
      id,
      name: existingCrop.name,
      message: `${id}`,
    };
  }

  async permanentDelete(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingCrop = await this.cropRepository.findOneBy({ id });

    if (!existingCrop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }

    const isCropAssociatedWithGrowingCropPeriod = await this.entityManager
      .getRepository(GrowingCropPeriod)
      .createQueryBuilder("growingCropperiod")
      .where("growingCropperiod.crop_id = :id", { id })
      .getCount();

    if (isCropAssociatedWithGrowingCropPeriod > 0) {
      throw new BadRequestException(
        `This crop with ID ${id} has associated growingCropPeriod. Cannot delete the crop.`,
      );
    }

    await this.cropRepository.remove(existingCrop);

    return {
      id,
      name: existingCrop.name,
      message: `${id}`,
    };
  }
}
