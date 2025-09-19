import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AppService, ExecuteInput } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ ok: true });
  }

  // Основной маршрут по ТЗ: вернуть массив monstertypes
  @Get("monstertypes")
  async getMonstertypes(@Res() res: Response) {
    try {
      const monstertypes = await this.appService.getMonstertypes();
      return res.status(HttpStatus.OK).json({ monstertypes });
    } catch (e: any) {
      if (e?.code === "DB_CONNECT_ERROR") {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ errorText: "Ошибка подключения к базе данных" });
      }
      console.error("Unexpected error in /monstertypes:", e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ errorText: "Внутренняя ошибка сервера" });
    }
  }

  // Пример POST, как в образце (оставлен для совместимости с структурой)
  @Post("execute")
  async execute(@Body() body: ExecuteInput, @Res() res: Response) {
    try {
      // просто эхо, чтобы маршрут существовал (как «каркас»)
      return res.status(HttpStatus.OK).json({ received: body ?? null });
    } catch (e: any) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ errorText: "Внутренняя ошибка сервера." });
    }
  }
}
