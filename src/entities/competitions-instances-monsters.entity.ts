import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("competitionsinstancesmonsters")
export class CompetitionsInstancesMonsters {
  @PrimaryGeneratedColumn()
  id: number; // Assuming an ID field; adjust if needed

  @Column()
  monsterid: number;

  @Column({ nullable: true })
  monsterimage: string;

  // Add other fields if known
}
