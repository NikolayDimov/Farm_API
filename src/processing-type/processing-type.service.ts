import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ProcessingType } from "./processing-type.entity";
import { validate } from "class-validator";
import { CreateProcessingTypeDto } from "./dtos/create-processing-type.dto";
import { UpdateProcessingTypeDto } from "./dtos/update-prcessing-type.dto";

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
      await this.processingTypeRepository.findOneBy({
        id,
      });
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
      where: { name },
    });

    if (createProcessingTypeDto.name === existingProcessingType.name) {
      throw new BadRequestException(`Processing type already exists!`);
    }

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

    if (updateProcessingTypeDto.name) {
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

    // const isProcessingTypeAssociatedWithProcessings =
    //   await this.processingService.isProcessingTypeAssociatedWithProcessings(
    //     id,
    //   );

    // if (isProcessingTypeAssociatedWithProcessings) {
    //   throw new BadRequestException(
    //     `This processing type with ID ${id} has associated Processing. Cannot delete the processing type.`,
    //   );
    // }

    // Soft delete using the softDelete method
    await this.processingTypeRepository.softDelete({ id });

    return {
      id,
      name: existingProcessingType.name,
      message: `Successfully permanently deleted Processing Type with id ${id}, name ${existingProcessingType.name}`,
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

    // const isProcessingTypeAssociatedWithProcessings =
    //   await this.processingService.isProcessingTypeAssociatedWithProcessings(
    //     id,
    //   );

    // if (isProcessingTypeAssociatedWithProcessings) {
    //   throw new BadRequestException(
    //     `This processing type with ID ${id} has associated Processing. Cannot delete the processing type.`,
    //   );
    // }

    // Perform the permanent delete
    await this.processingTypeRepository.remove(existingProcessingType);

    return {
      id,
      name: existingProcessingType.name,
      message: `Successfully permanently deleted Processing Type with id ${id}, name ${existingProcessingType.name}`,
    };
  }
}
