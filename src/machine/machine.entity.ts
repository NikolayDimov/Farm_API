import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Farm } from "../farm/farm.entity";
import { Processing } from "../processing/processing.entity";

@Entity()
export class Machine {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ nullable: false })
  model: string;

  @Column({ name: "register_number", unique: true, nullable: false })
  registerNumber: string;

  @Column({ type: "uuid", nullable: false })
  farm_id: string;

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
