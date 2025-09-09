import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";

// Если ваш рантайм Node < 18, подключите node-fetch в package.json и раскомментируйте:
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const fetch = globalThis.fetch ?? require('node-fetch');

type ImpactRow = {
  id: number;
  buttonimageurl: string | null;
  name: string;
  effectdescription: string | null;
  function: string | null;
  energyprice: number | null;
  minendurance: number | null;
};

@Injectable()
export class AppService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private readonly characteristicsFnUrl =
    "https://monstercharacteristics-production.up.railway.app/characteristics";

  /**
   * Полная логика исходной функции:
   * 1) Получаем выносливость монстра через внешнюю YC-функцию (characteristics, id=10012).
   * 2) Берём базовые impacts (base=true).
   * 3) Плюсуем доп. impacts, у которых SUM(value) > 0 (без дублей).
   * 4) Из истории берём последние 3 impactid и помечаем их available=false.
   * 5) Для остальных available = (minendurance IS NULL) OR (minendurance < monsterEndurance).
   * 6) Если нечего возвращать — 404.
   */
  async buildMonsterImpacts(monsterId: number) {
    try {
      // 1) endurance монстра через внешнюю функцию
      const monsterEndurance = await this.fetchMonsterEndurance(monsterId);

      // 2) базовые impacts
      const baseRows: ImpactRow[] = await this.dataSource.query(
        `
        SELECT id, buttonimageurl, name, effectdescription, "function", energyprice, minendurance
        FROM impacts
        WHERE base = true
        `
      );

      const monsterImpacts = baseRows.map((row) => ({
        id: Number(row.id),
        image: row.buttonimageurl,
        name: row.name,
        comment: row.effectdescription,
        method: row.function,
        energyprice: row.energyprice,
        minendurance: row.minendurance,
        available: null as boolean | null,
      }));

      const existingImpactIds = new Set<number>(
        monsterImpacts.map((i) => i.id)
      );

      // 3) доп. impacts по SUM(value) > 0
      const extraIdsRows: { impactid: number }[] = await this.dataSource.query(
        `
        SELECT impactid
        FROM monstersextraimpacts
        WHERE monsterid = $1
        GROUP BY impactid
        HAVING SUM(value) > 0
        `,
        [monsterId]
      );

      const extraIds = extraIdsRows
        .map((r) => Number(r.impactid))
        .filter((id) => !existingImpactIds.has(id));

      if (extraIds.length > 0) {
        // оптимизируем: одним запросом подтягиваем все нужные дополнительные импакты
        const extraRows: ImpactRow[] = await this.dataSource.query(
          `
          SELECT id, buttonimageurl, name, effectdescription, "function", energyprice, minendurance
          FROM impacts
          WHERE id = ANY($1::int[])
          `,
          [extraIds]
        );

        for (const impact of extraRows) {
          monsterImpacts.push({
            id: Number(impact.id),
            image: impact.buttonimageurl,
            name: impact.name,
            comment: impact.effectdescription,
            method: impact.function,
            energyprice: impact.energyprice,
            minendurance: impact.minendurance,
            available: null,
          });
          existingImpactIds.add(Number(impact.id));
        }
      }

      // 4) последние 3 из истории — unavailable
      const historyRows: { impactid: number }[] = await this.dataSource.query(
        `
        SELECT impactid
        FROM monstersimpactshistory
        WHERE monsterid = $1
        ORDER BY id DESC
        LIMIT 3
        `,
        [monsterId]
      );
      const recentSet = new Set<number>(
        historyRows.map((r) => Number(r.impactid))
      );
      for (const imp of monsterImpacts) {
        if (recentSet.has(imp.id)) {
          imp.available = false;
        }
      }

      // 5) для остальных — проверка выносливости (строгое сравнение <)
      for (const imp of monsterImpacts) {
        if (imp.available === null) {
          imp.available =
            imp.minendurance === null ||
            (typeof imp.minendurance === "number" &&
              imp.minendurance < monsterEndurance);
        }
      }

      // 6) если пусто — 404
      if (monsterImpacts.length === 0) {
        throw new NotFoundException("Взаимодействия не найдены");
      }

      return monsterImpacts;
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof BadGatewayException) {
        throw e;
      }
      throw new InternalServerErrorException("Внутренняя ошибка сервера");
    }
  }

  private async fetchMonsterEndurance(monsterId: number): Promise<number> {
    const res = await fetch(this.characteristicsFnUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monsterId }),
    });

    if (!res.ok) {
      throw new BadGatewayException(
        "Ошибка при вызове внешней функции характеристик монстра"
      );
    }

    const data = await res.json();
    const arr = Array.isArray(data?.monstercharacteristics)
      ? data.monstercharacteristics
      : [];
    const enduranceObj = arr.find((c: any) => c?.id === 10012);
    const enduranceVal =
      enduranceObj && typeof enduranceObj.value === "number"
        ? enduranceObj.value
        : 0;

    return Number(enduranceVal) || 0;
  }
}
