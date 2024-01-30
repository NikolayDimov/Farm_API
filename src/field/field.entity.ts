import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { MultiPolygon, Polygon } from "geojson";

@Entity("field")
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 120, nullable: false })
  name: string;

  @Column({ type: "jsonb", nullable: false })
  boundary: MultiPolygon | Polygon;

  @Column({ type: "uuid", name: "farm_id", nullable: false })
  farmId: string;

  @Column({ type: "uuid", name: "soil_id", nullable: false })
  soilId: string;

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
