import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm"; // Импортируем Not
import { UsersAndMonsters } from "./entities/users-and-monsters.entity";
import { CompetitionsInstancesMonsters } from "./entities/competitions-instances-monsters.entity";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UsersAndMonsters)
    private usersAndMonstersRepository: Repository<UsersAndMonsters>,
    @InjectRepository(CompetitionsInstancesMonsters)
    private competitionsInstancesMonstersRepository: Repository<CompetitionsInstancesMonsters>
  ) {}

  async hasCompetitionHistory(userId: number): Promise<boolean> {
    const userMonsters = await this.usersAndMonstersRepository.find({
      where: { userid: userId },
    });

    let competitionsincount = 0;

    for (const monster of userMonsters) {
      const count = await this.competitionsInstancesMonstersRepository.count({
        where: {
          monsterid: monster.monsterid,
          monsterimage: Not(""), // Теперь Not определён
        },
      });
      competitionsincount += count;
    }

    return competitionsincount > 0;
  }
}
