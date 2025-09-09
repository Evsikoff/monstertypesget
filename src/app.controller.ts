import { Body, Controller, Post, BadRequestException } from "@nestjs/common";
import { AppService } from "./app.service";

type TeachEnergyRequest = { userId: number };
type TeachEnergyResponse = {
  teachenergy: number;
  nextfreereplenishment: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("teachenergy")
  async getTeachEnergy(
    @Body() body: TeachEnergyRequest
  ): Promise<TeachEnergyResponse> {
    const userId = body?.userId;
    if (!Number.isInteger(userId)) {
      throw new BadRequestException("Invalid userId: must be an integer");
    }
    return this.appService.calculateTeachEnergy(userId);
  }
}
