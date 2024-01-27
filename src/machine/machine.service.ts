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

@Injectable()
export class MachineService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
  ) {}

  async findOneByName(
    brand: string,
    model: string,
    registerNumber: string,
  ): Promise<Machine> {
    const machineName = await this.machineRepository.findOne({
      where: { brand, model, registerNumber },
    });
    return machineName;
  }

  async findAll() {
    const machines = await this.machineRepository.find({});
    if (!machines) {
      throw new NotFoundException(`No machines found`);
    }
    return machines;
  }

  async findOneById(id: string): Promise<Machine> {
    const existingmMachine = await this.machineRepository.findOneBy({ id });
    return existingmMachine;
  }

  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const errors = await validate(createMachineDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { brand, model, registerNumber, farmId } = createMachineDto;

    // const farm = await this.farmService.findOneById(farmId);
    // if (!farm) {
    //   throw new BadRequestException(`No farm found!`);
    // }

    const existingMachine = await this.machineRepository.findOne({
      where: { registerNumber },
    });

    if (createMachineDto.registerNumber === existingMachine.registerNumber) {
      throw new BadRequestException(
        `Machine with register number already exists!`,
      );
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

    // const isMachineAssociatedWithProcessings =
    //   await this.processingService.isMachineAssociatedWithProcessings(id);

    // if (isMachineAssociatedWithProcessings) {
    //   throw new BadRequestException(
    //     `This field with ID ${id} has associated GrowingCropPeriods. Cannot update the field.`,
    //   );
    // }

    const updateResult = await this.machineRepository.update(
      id,
      updateMachineDto,
    );
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
  // async transferMachine(id: string, newFarmId: string): Promise<Machine> {
  //   const existingMachine = await this.machineRepository.findOne({
  //     where: { id },
  //     relations: ["processings", "farm"],
  //   });

  //   if (!existingMachine) {
  //     throw new NotFoundException(`Machine with id ${id} not found`);
  //   }

  //   if (existingMachine.processings && existingMachine.processings.length > 0) {
  //     throw new BadRequestException(
  //       "This machine has associated processing. Cannot be transferred.",
  //     );
  //   }

  //   // Validate and update the farm
  //   const newFarm = await this.farmService.findOne(newFarmId);

  //   if (!newFarm) {
  //     throw new BadRequestException("No farm found with the provided farmId");
  //   }

  //   existingMachine.farm = newFarm;

  //   return await this.machineRepository.save(existingMachine);
  // }

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

    // const isMachineAssociatedWithProcessings =
    //   await this.processingService.isMachineAssociatedWithProcessings(id);

    // if (isMachineAssociatedWithProcessings) {
    //   throw new BadRequestException(
    //     `This machine with ID ${id} has associated Processing. Cannot delete the machine.`,
    //   );
    // }

    await this.machineRepository.softDelete({ id });

    return {
      id,
      brand: existingMachine.brand,
      model: existingMachine.model,
      registerNumber: existingMachine.registerNumber,
      message: `Successfully soft deleted Machine with id ${id}, Brand ${existingMachine.brand}, Model ${existingMachine.model} and Register Number ${existingMachine.registerNumber}`,
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

    // const isMachineAssociatedWithProcessings =
    //   await this.processingService.isMachineAssociatedWithProcessings(id);

    // if (isMachineAssociatedWithProcessings) {
    //   throw new BadRequestException(
    //     `This machine with ID ${id} has associated Processing. Cannot delete the machine.`,
    //   );
    // }

    await this.machineRepository.remove(existingMachine);

    return {
      id,
      brand: existingMachine.brand,
      model: existingMachine.model,
      registerNumber: existingMachine.registerNumber,
      message: `Successfully permanently deleted Machine with id ${id}, Brand ${existingMachine.brand}, Model ${existingMachine.model} and Register Number ${existingMachine.registerNumber}`,
    };
  }
}
