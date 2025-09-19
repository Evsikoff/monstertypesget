import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

export type ExecuteInput = {
  yandexUserId?: string;
  yandexUserName?: string | null;
  yandexUserPhotoURL?: string | null;
  fingerprint?: string;
  googleUserId?: string;
  vkUserId?: string;
};

@Injectable()
export class AppService {
  private pool: Pool;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      const err: any = new Error("DATABASE_URL is not set");
      err.code = "DB_CONNECT_ERROR";
      throw err;
    }

    const rootPath =
      process.env.PGSSLROOTCERT ??
      path.resolve(process.cwd(), ".postgresql", "root.crt");

    let ssl: any = undefined;
    if (fs.existsSync(rootPath)) {
      const ca = fs.readFileSync(rootPath, "utf-8");
      ssl = { ca, rejectUnauthorized: true };
    } else if (process.env.NODE_ENV !== "development") {
      // для prod без CA лучше падать, но оставим мягкий режим под codesandbox:
      console.warn(
        `PG root CA not found at ${rootPath}. For production, provide ./.postgresql/root.crt or PGSSLROOTCERT.`
      );
      ssl = { rejectUnauthorized: false };
    }

    this.pool = new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl,
    });

    this.pool.on("error", (err) => console.error("Database pool error:", err));
  }

  // === ЛОГИКА ПО ТЗ ===
  // Получить все монстр-тайпы: SELECT number, name, activity, image, price FROM monstertypes
  async getMonstertypes() {
    const sql =
      "SELECT number, name, activity, image, price FROM monstertypes ORDER BY number ASC";
    const { rows } = await this.pool.query(sql);

    const monstertypes = [];
    for (const r of rows) {
      monstertypes.push({
        number: Number(r.number),
        name: String(r.name),
        activity: Boolean(r.activity),
        image: String(r.image),
        price: Number(r.price),
      });
    }
    return monstertypes;
  }
}
