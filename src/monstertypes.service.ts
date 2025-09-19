import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { Monstertype } from './types';

@Injectable()
export class MonstertypesService implements OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      const err: any = new Error('DATABASE_URL is not set');
      err.code = 'DB_CONNECT_ERROR';
      throw err;
    }

    const caPath =
      process.env.PGSSLROOTCERT ||
      path.resolve(process.cwd(), '.postgresql', 'root.crt');

    if (!fs.existsSync(caPath)) {
      throw new Error(
        `PostgreSQL root CA not found at ${caPath}. Put CA to ./.postgresql/root.crt or set PGSSLROOTCERT`
      );
    }

    const ca = fs.readFileSync(caPath, 'utf-8');

    this.pool = new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: { ca, rejectUnauthorized: true }
    });

    this.pool.on('error', (err) => {
      // как в примере — логируем ошибки пула
      console.error('Database pool error:', err);
    });
  }

  async onModuleDestroy() {
    await this.pool.end().catch(() => void 0);
  }

  /**
   * Реализация алгоритма из ТЗ:
   * - создать временный массив monstertypes
   * - найти все записи в таблице "monstertypes"
   * - для каждой записи добавить объект { number, name, activity, image, price }
   * - вернуть массив
   */
  async getAll(): Promise<Monstertype[]> {
    const sql =
      'SELECT number, name, activity, image, price FROM monstertypes ORDER BY number ASC';
    const { rows } = await this.pool.query(sql);

    // формируем временный массив согласно ТЗ
    const monstertypes: Monstertype[] = [];
    for (const r of rows) {
      monstertypes.push({
        number: Number(r.number),
        name: String(r.name),
        activity: Boolean(r.activity),
        image: String(r.image),
        price: Number(r.price)
      });
    }
    return monstertypes;
  }
}
