import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "competitionsinstancesmonsters" })
export class CompetitionsInstancesMonsters {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", nullable: false })
  monsterid!: number;

  @Column({ type: "text", nullable: true })
  monsterimage!: string | null;
}
