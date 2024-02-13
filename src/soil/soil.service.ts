import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { validate } from "class-validator";
import { Soil } from "./soil.entity";
import { CreateSoilDto } from "./dtos/create-soil.dto";
import { UpdateSoilDto } from "./dtos/update-soil.dto";
import { Field } from "src/field/field.entity";

@Injectable()
export class SoilService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Soil)
    private soilRepository: Repository<Soil>,
  ) {}

  async findAll() {
    const soils = await this.soilRepository.find({
      order: {
        created: "DESC",
      },
    });
    if (!soils) {
      throw new NotFoundException(`No soils found`);
    }
    return soils;
  }

  async findOneById(id: string): Promise<Soil> {
    const existingSoildId = await this.soilRepository.findOneBy({ id });
    if (!existingSoildId) {
      throw new NotFoundException(`No soil found`);
    }
    return existingSoildId;
  }

  async create(createSoilDto: CreateSoilDto): Promise<Soil> {
    const errors = await validate(createSoilDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name } = createSoilDto;

    const existingSoil = await this.soilRepository.findOne({
      withDeleted: true,
      where: { name },
    });

    if (existingSoil) {
      // If the soil exists and is soft-deleted, restore it
      if (existingSoil.deleted) {
        existingSoil.deleted = null;
        return await this.soilRepository.save(existingSoil);
      } else {
        // If the soil is not soft-deleted, throw a conflict exception
        throw new ConflictException(`Soil ${name} already exists`);
      }
    }
    // const existingSoil = await this.soilRepository.findOne({
    //   where: { name },
    // });

    // if (existingSoil && createSoilDto.name === existingSoil.name) {
    //   throw new BadRequestException(`Soil already exists!`);
    // }

    const newSoil = this.soilRepository.create({ name });
    const newCreatedSoil = await this.soilRepository.save(newSoil);
    return newCreatedSoil;
  }

  async update(id: string, updateSoilDto: UpdateSoilDto): Promise<Soil> {
    const existingSoil = await this.soilRepository.findOneBy({ id });
    if (!existingSoil) {
      throw new NotFoundException(`Soil with ID ${id} not found`);
    }

    if (updateSoilDto.name) {
      const existingSoilWithSameName = await this.soilRepository.findOne({
        where: { name: updateSoilDto.name },
      });

      if (existingSoilWithSameName && existingSoilWithSameName.id !== id) {
        throw new ConflictException(
          `Soil with name ${updateSoilDto.name} already exists`,
        );
      }

      await this.soilRepository.update(id, { name: updateSoilDto.name });
    }

    const updatedSoil = await this.soilRepository.findOneBy({ id });
    if (!updatedSoil) {
      throw new NotFoundException(`Updated soil with ID ${id} not found`);
    }

    return updatedSoil;
  }

  async softDetele(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingSoil = await this.soilRepository.findOneBy({ id });

    if (!existingSoil) {
      throw new NotFoundException(`Soil with id ${id} not found`);
    }

    const isSoilAssociatedWithFields = await this.entityManager
      .getRepository(Field)
      .createQueryBuilder("field")
      .where("field.soil_id = :id", { id })
      .getCount();

    if (isSoilAssociatedWithFields > 0) {
      throw new BadRequestException(
        `This soil with ID ${id} has associated fields. Cannot delete the soil.`,
      );
    }

    await this.soilRepository.softDelete({ id });

    return {
      id,
      name: existingSoil.name,
      message: `${id}`,
    };
  }

  async permanentDelete(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingSoil = await this.soilRepository.findOneBy({ id });

    if (!existingSoil) {
      throw new NotFoundException(`Soil with id ${id} not found`);
    }

    const isSoilAssociatedWithFields = await this.entityManager
      .getRepository(Field)
      .createQueryBuilder("field")
      .where("field.soil_id = :id", { id })
      .getCount();

    if (isSoilAssociatedWithFields > 0) {
      throw new BadRequestException(
        `This soil with ID ${id} has associated fields. Cannot delete the soil.`,
      );
    }

    await this.soilRepository.remove(existingSoil);

    return {
      id,
      name: existingSoil.name,
      message: `${id}`,
    };
  }
}
