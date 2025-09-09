import { BadRequestException, Controller, Post, Body } from "@nestjs/common";
import { AppService } from "./app.service";

type MonsterImpactsRequest = { monsterId: number };
type MonsterImpact = {
  id: number;
  image: string | null;
  name: string;
  comment: string | null;
  method: string | null;
  energyprice: number | null;
  minendurance: number | null;
  available: boolean | null;
};
type MonsterImpactsResponse = { monsterimpacts: MonsterImpact[] };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("monster-impacts")
  async getMonsterImpacts(
    @Body() body: MonsterImpactsRequest
  ): Promise<MonsterImpactsResponse> {
    const monsterId = body?.monsterId;
    if (!Number.isInteger(monsterId)) {
      throw new BadRequestException("Некорректный или отсутствующий monsterId");
    }
    const monsterimpacts = await this.appService.buildMonsterImpacts(monsterId);
    return { monsterimpacts };
  }
}
