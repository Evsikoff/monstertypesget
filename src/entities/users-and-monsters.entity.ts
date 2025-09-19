import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "usersandmonsters" })
export class UsersAndMonsters {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", nullable: false })
  userid!: number;

  @Column({ type: "int", nullable: false })
  monsterid!: number;
}
