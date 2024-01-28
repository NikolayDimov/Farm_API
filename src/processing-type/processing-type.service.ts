import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ProcessingType } from "./processing-type.entity";
import { validate } from "class-validator";
import { CreateProcessingTypeDto } from "./dtos/create-processing-type.dto";
import { UpdateProcessingTypeDto } from "./dtos/update-prcessing-type.dto";
import { Processing } from "src/processing/processing.entity";

@Injectable()
export class ProcessingTypeService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(ProcessingType)
    private processingTypeRepository: Repository<ProcessingType>,
  ) {}

  async findAll() {
    const processingType = await this.processingTypeRepository.find({});
    if (!processingType) {
      throw new NotFoundException(`No processingType found`);
    }
    return processingType;
  }

  async findOneById(id: string): Promise<ProcessingType> {
    const existingProcessingType =
      await this.processingTypeRepository.findOneBy({ id });
    return existingProcessingType;
  }

  async create(
    createProcessingTypeDto: CreateProcessingTypeDto,
  ): Promise<ProcessingType> {
    const errors = await validate(createProcessingTypeDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name } = createProcessingTypeDto;

    const existingProcessingType = await this.processingTypeRepository.findOne({
      withDeleted: true,
      where: { name },
    });

    if (existingProcessingType) {
      // If the ProcessingType exists and is soft-deleted, restore it
      if (existingProcessingType.deleted) {
        existingProcessingType.deleted = null;
        return await this.processingTypeRepository.save(existingProcessingType);
      } else {
        // If the soil is not soft-deleted, throw a conflict exception
        throw new ConflictException(`Processng Type ${name} already exists`);
      }
    }
    // const existingProcessingType = await this.processingTypeRepository.findOne({
    //   where: { name },
    // });

    // if (
    //   existingProcessingType &&
    //   createProcessingTypeDto.name === existingProcessingType.name
    // ) {
    //   throw new BadRequestException(`Processing type already exists!`);
    // }

    const newProcessingType = this.processingTypeRepository.create({
      name,
    });
    const newCreatedProcessingType =
      await this.processingTypeRepository.save(newProcessingType);
    return newCreatedProcessingType;
  }

  async update(
    id: string,
    updateProcessingTypeDto: UpdateProcessingTypeDto,
  ): Promise<ProcessingType> {
    const existingProcessingType =
      await this.processingTypeRepository.findOneBy({ id });
    if (!existingProcessingType) {
      throw new NotFoundException(`Processing Type with ID ${id} not found`);
    }

    if (updateProcessingTypeDto.name) {
      const existingProcessingTypeWithSameName =
        await this.processingTypeRepository.findOne({
          where: { name: updateProcessingTypeDto.name },
        });
      if (
        existingProcessingTypeWithSameName &&
        existingProcessingTypeWithSameName.id !== id
      ) {
        throw new ConflictException(
          `Processing Type with name ${updateProcessingTypeDto.name} already exists`,
        );
      }
      await this.processingTypeRepository.update(id, {
        name: updateProcessingTypeDto.name,
      });
    }

    const updatedProcessingType = await this.processingTypeRepository.findOneBy(
      { id },
    );
    if (!updatedProcessingType) {
      throw new NotFoundException(
        `Updated Processing Type with ID ${id} not found`,
      );
    }

    return updatedProcessingType;
  }

  async softDelete(id: string): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    const existingProcessingType =
      await this.processingTypeRepository.findOneBy({ id });

    if (!existingProcessingType) {
      throw new NotFoundException(`Processing Type with id ${id} not found`);
    }

    const isProcessingTypeAssociatedWithProcessing = await this.entityManager
      .getRepository(Processing)
      .createQueryBuilder("processing")
      .where("processing.processing_type_id = :id", { id })
      .getCount();

    if (isProcessingTypeAssociatedWithProcessing > 0) {
      throw new BadRequestException(
        `This Processing type with ID ${id} has associated processing. Cannot delete the processing type.`,
      );
    }

    await this.processingTypeRepository.softDelete({ id });

    return {
      id,
      name: existingProcessingType.name,
      message: `${id}`,
    };
  }

  async permanentDelete(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingProcessingType =
      await this.processingTypeRepository.findOneBy({ id });

    if (!existingProcessingType) {
      throw new NotFoundException(`Processing Type with id ${id} not found`);
    }

    const isProcessingTypeAssociatedWithProcessing = await this.entityManager
      .getRepository(Processing)
      .createQueryBuilder("processing")
      .where("processing.processing_type_id = :id", { id })
      .getCount();

    if (isProcessingTypeAssociatedWithProcessing > 0) {
      throw new BadRequestException(
        `This Processing type with ID ${id} has associated processing. Cannot delete the processing type.`,
      );
    }

    await this.processingTypeRepository.remove(existingProcessingType);

    return {
      id,
      name: existingProcessingType.name,
      message: `${id}`,
    };
  }
}
