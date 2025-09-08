import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("usersandmonsters")
export class UsersAndMonsters {
  @PrimaryGeneratedColumn()
  id: number; // Assuming an ID field; adjust if needed

  @Column()
  userid: number;

  @Column()
  monsterid: number;

  // Add other fields if known
}
