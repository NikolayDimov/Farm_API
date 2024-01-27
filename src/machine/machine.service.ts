import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { validate } from "class-validator";
import { Machine } from "./machine.entity";
import { CreateMachineDto } from "./dtos/create-machine.dto";
import { UpdateMachineDto } from "./dtos/update-machine.dto";
import { FarmService } from "src/farm/farm.service";
import { Processing } from "src/processing/processing.entity";

@Injectable()
export class MachineService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
    private readonly farmService: FarmService,
  ) {}

  async findAll() {
    const machines = await this.machineRepository.find({});
    if (!machines) {
      throw new NotFoundException(`No machine found!`);
    }
    return machines;
  }

  async findOneById(id: string): Promise<Machine> {
    const existingMachineId = await this.machineRepository.findOneBy({ id });
    return existingMachineId;
  }

  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const errors = await validate(createMachineDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { brand, model, registerNumber, farmId } = createMachineDto;

    const existingMachine = await this.machineRepository.findOne({
      where: { registerNumber },
    });

    if (existingMachine && existingMachine.registerNumber === registerNumber) {
      throw new BadRequestException(
        `Machine with register ${registerNumber} number already exists!`,
      );
    }

    const farm = await this.farmService.findOneById(farmId);
    if (!farm) {
      throw new BadRequestException(`No farm found!`);
    }

    const newMachine = this.machineRepository.create({
      brand,
      model,
      registerNumber,
      farm_id: farmId,
    });

    const newCreatedMachine = await this.machineRepository.save(newMachine);
    return newCreatedMachine;
  }

  async update(
    id: string,
    updateMachineDto: UpdateMachineDto,
  ): Promise<Machine> {
    const existingMachine = await this.machineRepository.findOneBy({ id });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    if (
      updateMachineDto.registerNumber &&
      existingMachine.registerNumber !== updateMachineDto.registerNumber
    ) {
      const duplicateMachine = await this.machineRepository.findOne({
        where: { registerNumber: updateMachineDto.registerNumber },
      });

      if (duplicateMachine) {
        throw new BadRequestException(
          `Machine with register ${updateMachineDto.registerNumber} number already exists!`,
        );
      }
    }

    // Perform the update without fetching the entity
    const updateResult = await this.machineRepository.update(
      id,
      updateMachineDto,
    );

    // Check if the update was successful
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    // Fetch and return the updated field
    const updatedMachine = await this.machineRepository.findOneBy({ id });

    if (!updatedMachine) {
      throw new NotFoundException(`Updated machine with ID ${id} not found`);
    }

    return updatedMachine;
  }

  // Tarnsferring machine from one Farm to another
  async transferMachine(id: string, newFarmId: string): Promise<Machine> {
    const existingMachine = await this.machineRepository.findOneBy({ id });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    const isMachineAssociatedWithProcessing = await this.entityManager
      .getRepository(Processing)
      .createQueryBuilder("processing")
      .where("processing.machine_id = :id", { id })
      .getCount();

    if (isMachineAssociatedWithProcessing > 0) {
      throw new BadRequestException(
        `This machine with ID ${id} has associated processing. Cannot delete the machine.`,
      );
    }

    // Validate and update the farm
    const changedFarm = await this.farmService.findOneById(newFarmId);
    if (!changedFarm) {
      throw new BadRequestException(`No farm found!`);
    }

    existingMachine.farm_id = newFarmId;

    return await this.machineRepository.save(existingMachine);
  }

  async softDelete(id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    const existingMachine = await this.machineRepository.findOneBy({ id });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    await this.machineRepository.softDelete({ id });

    return {
      id,
      brand: existingMachine.brand,
      model: existingMachine.model,
      registerNumber: existingMachine.registerNumber,
      message: `${id}`,
    };
  }

  async permanentDelete(id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    const existingMachine = await this.machineRepository.findOneBy({ id });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    await this.machineRepository.remove(existingMachine);

    return {
      id,
      brand: existingMachine.brand,
      model: existingMachine.model,
      registerNumber: existingMachine.registerNumber,
      message: `${id}`,
    };
  }
}
