import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProcessingController } from "./processing.controller";
import { Processing } from "./processing.entity";
import { ProcessingService } from "./processing.service";

@Module({
  imports: [TypeOrmModule.forFeature([Processing])],
  controllers: [ProcessingController],
  providers: [ProcessingService],
  exports: [ProcessingService],
})
export class ProcessingModule {}
