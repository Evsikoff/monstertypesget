import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersAndMonsters } from "./entities/users-and-monsters.entity";
import { CompetitionsInstancesMonsters } from "./entities/competitions-instances-monsters.entity";
import { join } from "path";
import * as fs from "fs";

const typeOrmUrl =
  process.env.DATABASE_URL ?? "postgresql://user:pass@host:5432/db"; // только как запасной дефолт

// Делаем конфигурацию TypeORM «как в образце», чтобы структура совпадала.
// (Фактически в этом приложении мы не используем репозитории — основная работа идёт через pg Pool в AppService.)
const sslCaPath =
  process.env.PGSSLROOTCERT ?? join(__dirname, "..", ".postgresql", "root.crt");
const sslCa = fs.existsSync(sslCaPath)
  ? [fs.readFileSync(sslCaPath, "utf-8")]
  : undefined;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: typeOrmUrl,
      entities: [UsersAndMonsters, CompetitionsInstancesMonsters],
      synchronize: false,
      ssl: sslCa ? { ca: sslCa } : undefined,
    }),
    TypeOrmModule.forFeature([UsersAndMonsters, CompetitionsInstancesMonsters]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
