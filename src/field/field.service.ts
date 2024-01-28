import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Field } from "./field.entity";
import { Farm } from "../farm/farm.entity";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { UpdateFieldDto } from "./dtos/update-field.dto";
import { GrowingCropPeriod } from "../growing-crop-period/growing-crop-period.entity";
import { Crop } from "../crop/crop.entity";
import { SoilService } from "src/soil/soil.service";
import { FarmService } from "src/farm/farm.service";
import { validate } from "class-validator";
import { Soil } from "src/soil/soil.entity";

@Injectable()
export class FieldService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Field) private fieldRepository: Repository<Field>,
    private readonly soilService: SoilService,
    private readonly farmService: FarmService,
  ) {}

  async findAll() {
    const fields = await this.fieldRepository.find({});
    if (!fields) {
      throw new NotFoundException(`No fields found!`);
    }
    return fields;
  }

  async findOneById(id: string): Promise<Field> {
    const existingFieldId = await this.fieldRepository.findOneBy({ id });
    if (!existingFieldId) {
      throw new NotFoundException(`No field found!`);
    }
    return existingFieldId;
  }

  async create(createFieldDto: CreateFieldDto): Promise<Field> {
    const errors = await validate(createFieldDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name, boundary, soilId, farmId } = createFieldDto;

    const existingField = await this.fieldRepository.findOne({
      where: { name },
    });

    if (existingField) {
      throw new BadRequestException(`Field with name ${name} already exists!`);
    }

    const soil = await this.soilService.findOneById(soilId);
    if (!soil) {
      throw new BadRequestException(`No soil found!`);
    }

    const farm = await this.farmService.findOneById(farmId);
    if (!farm) {
      throw new BadRequestException(`No farm found!`);
    }

    const newField = this.fieldRepository.create({
      name,
      boundary,
      farm_id: farmId,
      soil_id: soilId,
    });

    const newCreatedField = await this.fieldRepository.save(newField);
    return newCreatedField;
  }

  async update(id: string, updateFieldDto: UpdateFieldDto): Promise<Field> {
    const existingField = await this.fieldRepository.findOneBy({ id });

    if (!existingField) {
      throw new NotFoundException(`Field with id ${id} not found`);
    }

    const updatedProperties: Partial<Field> = {
      name: updateFieldDto.name,
      boundary: updateFieldDto.boundary,
      soil_id: updateFieldDto.soilId, // Ensure the property is mapped correctly
    };

    await this.fieldRepository.update(id, updatedProperties);

    const updatedField = await this.fieldRepository.findOneBy({ id });
    if (!updatedField) {
      throw new NotFoundException(`Updated field with ID ${id} not found`);
    }

    return updatedField;
  }

  async softDelete(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingField = await this.fieldRepository.findOneBy({ id });

    if (!existingField) {
      throw new NotFoundException(`Field with id ${id} not found`);
    }

    await this.fieldRepository.softDelete({ id });

    return {
      id,
      name: existingField.name,
      message: `${id}`,
    };
  }

  async permanentDelete(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingField = await this.fieldRepository.findOneBy({ id });

    if (!existingField) {
      throw new NotFoundException(`Field with id ${id} not found`);
    }

    await this.fieldRepository.remove(existingField);
    return {
      id,
      name: existingField.name,
      message: `${id}`,
    };
  }

  async getFieldsPerFarmAndCrop(): Promise<
    {
      cropId: string;
      cropName: string;
      farmId: string;
      farmName: string;
      fieldCount: number;
    }[]
  > {
    const fieldsPerFarmAndCrop = await this.fieldRepository
      .createQueryBuilder("field")
      .select([
        "farm.id AS farmId",
        "farm.name AS farmName",
        "crop.id AS cropId",
        "crop.name AS cropName",
        "CAST(COUNT(field.id)AS INTEGER) AS fieldCount",
      ])
      .innerJoin(Farm, "farm", "field.farm_id = farm.id")
      .innerJoin(
        GrowingCropPeriod,
        "growingCropPeriod",
        "field.id = growingCropPeriod.field_id",
      )
      .innerJoin(Crop, "crop", "crop.id = growingCropPeriod.crop_id")
      .groupBy("farm.id, crop.id")
      .orderBy("fieldCount", "DESC")
      .getRawMany();

    return fieldsPerFarmAndCrop;
  }

  // Without farm,name and soil.name
  // async getMostCommonSoilPerFarm(): Promise<
  //   {
  //     soilId: string;
  //     soilName: string;
  //     farmId: string;
  //     farmName: string;
  //     fieldCount: number;
  //   }[]
  // > {
  //   const fieldsPerFarmAndSoil = await this.fieldRepository
  //     .createQueryBuilder("field")
  //     .select([
  //       "field.farm_id AS farmId",
  //       "field.soil_id AS soilId",
  //       "CAST(COUNT(field.id) AS INTEGER) AS fieldCount",
  //     ])
  //     .innerJoin("soil", "soil", "field.soil_id = soil.id")
  //     .innerJoin("farm", "farm", "field.farm_id = farm.id")
  //     .groupBy("field.farm_id, field.soil_id")
  //     .orderBy("fieldCount", "DESC")
  //     .getRawMany();

  //   return fieldsPerFarmAndSoil;
  // }

  async getMostCommonSoilPerFarm(): Promise<
    {
      soilId: string;
      soilName: string;
      farmId: string;
      farmName: string;
      fieldCount: number;
    }[]
  > {
    const fieldsPerFarmAndSoil = await this.fieldRepository
      .createQueryBuilder("field")
      .select([
        "field.farm_id AS farmId",
        "farm.name AS farmName",
        "field.soil_id AS soilId",
        "soil.name AS soilName",
        "CAST(COUNT(field.id) AS INTEGER) AS fieldCount",
      ])
      .innerJoin("soil", "soil", "field.soil_id = soil.id")
      .innerJoin("farm", "farm", "field.farm_id = farm.id")
      .groupBy("field.farm_id, field.soil_id, farm.name, soil.name")
      .orderBy("fieldCount", "DESC")
      .getRawMany();

    return fieldsPerFarmAndSoil;
  }
}
