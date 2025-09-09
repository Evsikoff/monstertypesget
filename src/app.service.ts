import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class AppService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Полная логика из исходной функции:
   * - читаем записи userenergy по userid и type=1
   * - если записей нет — создаём первичную (amount=10, NOW() AT TIME ZONE 'UTC')
   * - если есть — суммируем amount, берём максимальную moment
   *   и при необходимости пополняем до 10, если прошло >= 10 часов
   * - возвращаем текущую сумму и ISO времени следующего пополнения
   */
  async calculateTeachEnergy(
    userId: number
  ): Promise<{ teachenergy: number; nextfreereplenishment: string }> {
    const selectSql = `
      SELECT amount, moment
      FROM userenergy
      WHERE userid = $1 AND type = 1
    `;

    try {
      // 1) первичное чтение
      let rows: { amount: string | number; moment: string }[] =
        await this.dataSource.query(selectSql, [userId]);

      if (rows.length === 0) {
        // 2) первичная инициализация
        const insertSql = `
          INSERT INTO userenergy (id, userid, type, amount, moment, comment)
          VALUES (nextval('ObjectId'), $1, 1, 10, NOW() AT TIME ZONE 'UTC', 'Первичное пополнение энергии')
          RETURNING amount, moment
        `;
        rows = await this.dataSource.query(insertSql, [userId]);
      } else {
        // 3) расчёт текущей суммы и последнего момента
        const nowteachenergy = rows.reduce(
          (sum, r) => sum + Number(r.amount),
          0
        );
        const momentmax = new Date(
          Math.max(...rows.map((r) => new Date(r.moment).getTime()))
        );

        // 4) проверка: прошло ли >=10 часов и нужно ли пополнение до 10
        const now = new Date();
        const hours = (now.getTime() - momentmax.getTime()) / (1000 * 60 * 60);

        if (hours >= 10 && nowteachenergy < 10) {
          const replenishAmount = 10 - nowteachenergy;
          const replenishSql = `
            INSERT INTO userenergy (id, userid, type, amount, moment, comment)
            VALUES (nextval('ObjectId'), $1, 1, $2, NOW() AT TIME ZONE 'UTC', 'Регулярное пополнение энергии')
          `;
          await this.dataSource.query(replenishSql, [userId, replenishAmount]);
        }
      }

      // 5) финальное чтение и ответ
      const finalRows: { amount: string | number; moment: string }[] =
        await this.dataSource.query(selectSql, [userId]);

      const teachenergy = finalRows.reduce(
        (sum, r) => sum + Number(r.amount),
        0
      );
      const momentmaxnew = new Date(
        Math.max(...finalRows.map((r) => new Date(r.moment).getTime()))
      );

      // следующее бесплатное пополнение через 10 часов
      const nextfreereplenishment = new Date(
        momentmaxnew.getTime() + 10 * 60 * 60 * 1000
      ).toISOString();

      return { teachenergy, nextfreereplenishment };
    } catch (err) {
      // Сообщение — в духе исходной функции
      throw new InternalServerErrorException(
        "Не удалось подключиться к базе данных"
      );
    }
  }
}
