import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("check")
  async checkCompetitionHistory(
    @Query("userId") userId: number
  ): Promise<{ competitionhistoryenable: boolean }> {
    const hasHistory = await this.appService.hasCompetitionHistory(userId);
    return { competitionhistoryenable: hasHistory };
  }
}
