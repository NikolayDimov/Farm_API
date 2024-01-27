import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FieldController } from "./field.controller";
import { FieldService } from "./field.service";
import { Field } from "./field.entity";
import { FarmModule } from "src/farm/farm.module";
import { SoilModule } from "src/soil/soil.module";

@Module({
  imports: [TypeOrmModule.forFeature([Field]), SoilModule, FarmModule],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [FieldService],
})
export class FieldModule {}
