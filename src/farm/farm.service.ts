import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Farm } from "./farm.entity";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { UpdateFarmDto } from "./dtos/update-farm.dto";
import { validate } from "class-validator";

@Injectable()
export class FarmService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Farm) private farmRepository: Repository<Farm>,
  ) {}

  async findAll() {
    const farms = await this.farmRepository.find({});
    if (!farms) {
      throw new NotFoundException(`No farms found`);
    }
    return farms;
  }

  async findOneById(id: string): Promise<Farm> {
    const existingFarm = await this.farmRepository.findOneBy({ id });
    return existingFarm;
  }

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const errors = await validate(createFarmDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name, location } = createFarmDto;

    const existingFarm = await this.farmRepository.findOne({
      withDeleted: true,
      where: { name },
    });

    if (existingFarm) {
      // If the farm exists and is soft-deleted, restore it
      if (existingFarm.deleted) {
        existingFarm.deleted = null;
        return await this.farmRepository.save(existingFarm);
      } else {
        // If the farm is not soft-deleted, throw a conflict exception
        throw new ConflictException(`Farm with name: ${name} already exists`);
      }
    }

    // const existingFarm = await this.farmRepository.findOne({
    //   where: { name },
    // });

    // if (existingFarm && createFarmDto.name === existingFarm.name) {
    //   throw new BadRequestException(`Farm already exists!`);
    // }

    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2 ||
      !location.coordinates.every((coord) => typeof coord === "number")
    ) {
      throw new Error("Invalid coordinates provided");
    }

    const newFarm = this.farmRepository.create({
      name,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
    });

    const newCreatedFarm = await this.farmRepository.save(newFarm);
    return newCreatedFarm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const existingFarm = await this.farmRepository.findOneBy({ id });
    if (!existingFarm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    if (updateFarmDto.name || updateFarmDto.location) {
      const updatedLocation = updateFarmDto.location
        ? { ...updateFarmDto.location, type: "Point" }
        : undefined;

      await this.farmRepository.update(id, {
        name: updateFarmDto.name,
        location: updatedLocation,
      });
    }

    const updatedFarm = await this.farmRepository.findOneBy({ id });
    if (!updatedFarm) {
      throw new NotFoundException(`Updated farm with ID ${id} not found`);
    }

    return updatedFarm;
  }

  async softDetele(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingFarm = await this.farmRepository.findOneBy({ id });

    if (!existingFarm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }

    await this.farmRepository.softDelete({ id });

    return {
      id,
      name: existingFarm.name,
      message: `${id}`,
    };
  }

  async permanentDelete(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingFarm = await this.farmRepository.findOneBy({ id });

    if (!existingFarm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }

    await this.farmRepository.remove(existingFarm);

    return {
      id,
      name: existingFarm.name,
      message: `${id}`,
    };
  }

  // Farm with most machines
  async getFarmsWithMostMachines(): Promise<
    { farmId: string; farmName: string; machineCount: number }[]
  > {
    const result = await this.farmRepository
      .createQueryBuilder("farm")
      .leftJoin("machine", "machines", "machines.farm_id = farm.id")
      .select([
        "farm.id as farmId",
        "farm.name as farmName",
        "CAST(COUNT(DISTINCT machines.id) AS INTEGER) as machineCount",
      ])
      .groupBy("farm.id, farm.name")
      .orderBy("machineCount", "DESC")
      .limit(10)
      .getRawMany();

    return result;
  }
}
