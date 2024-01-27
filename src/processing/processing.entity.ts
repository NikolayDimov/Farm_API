import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from "typeorm";

import { IsDateString } from "class-validator";

@Entity()
export class Processing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date", nullable: false })
  @IsDateString()
  date: Date;

  @Column({ type: "uuid", nullable: false })
  growing_crop_period_id: string;

  @Column({ type: "uuid", nullable: false })
  processing_type_id: string;

  @Column({ type: "uuid", nullable: false })
  machine_id: string;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created: Date;

  @UpdateDateColumn({
    type: "timestamp",
    onUpdate: "CURRENT_TIMESTAMP",
    name: "updated_at",
  })
  updated: Date;

  @DeleteDateColumn({ type: "timestamp", name: "deleted_at", nullable: true })
  deleted: Date;
}
