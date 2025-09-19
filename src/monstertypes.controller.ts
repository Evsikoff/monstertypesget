import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MonstertypesService } from './monstertypes.service';

@Controller()
export class MonstertypesController {
  constructor(private readonly service: MonstertypesService) {}

  // Простой healthcheck
  @Get('health')
  async health(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ ok: true });
  }

  // Основной маршрут по ТЗ
  @Get('monstertypes')
  async getMonstertypes(@Res() res: Response) {
    try {
      const monstertypes = await this.service.getAll();
      return res.status(HttpStatus.OK).json({ monstertypes });
    } catch (e: any) {
      if (e?.code === 'DB_CONNECT_ERROR') {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          errorText: 'Ошибка подключения к базе данных'
        });
      }
      console.error('Unexpected error:', e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ errorText: 'Внутренняя ошибка сервера' });
    }
  }
}
