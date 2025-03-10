import { Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { FarmModule } from "./farm/farm.module";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/guards/auth.guard";
import { FieldModule } from "./field/field.module";
import { SoilModule } from "./soil/soil.module";
import { MachineModule } from "./machine/machine.module";
import { CropModule } from "./crop/crop.module";
import {
  GlobalExceptionFilter,
  //HttpExceptionFilter,
} from "./filters/HttpExceptionFilter";
import { ReportModule } from "./report/report.module";
//import { dataSourceOptions } from "db/data-source";
import { Farm } from "./farm/farm.entity";
import { User } from "./user/user.entity";
import { Field } from "./field/field.entity";
import { Soil } from "./soil/soil.entity";
import { Machine } from "./machine/machine.entity";
import { Crop } from "./crop/crop.entity";
import { GrowingCropPeriod } from "./growing-crop-period/growing-crop-period.entity";
import { GrowingCropPeriodModule } from "./growing-crop-period/growing-crop-period.module";
import { Processing } from "./processing/processing.entity";
import { ProcessingType } from "./processing-type/processing-type.entity";
import * as dotenv from "dotenv";
import { ProcessingTypeModule } from "./processing-type/processing-type.module";
import { ProcessingModule } from "./processing/processing.module";
dotenv.config();

@Module({
  imports: [
    // ConfigModule.forRoot(),
    // TypeOrmModule.forRoot(dataSourceOptions),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "postgres",
          host: "localhost",
          port: 5432,
          // username: config.get<string>("USERNAME"),
          username: config.get<string>("DB_USERNAME"),
          password: config.get<string>("PASSWORD"),
          database: config.get<string>("DB_NAME"),
          entities: [
            User,
            Farm,
            Soil,
            Field,
            Machine,
            Crop,
            GrowingCropPeriod,
            Processing,
            ProcessingType,
          ],
          synchronize: false,
        };
      },
    }),

    AuthModule,
    UserModule,
    FarmModule,
    SoilModule,
    FieldModule,
    MachineModule,
    CropModule,
    GrowingCropPeriodModule,
    ProcessingTypeModule,
    ProcessingModule,
    ReportModule,
  ],
  controllers: [],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule { }
