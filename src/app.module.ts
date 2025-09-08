import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersAndMonsters } from "./entities/users-and-monsters.entity";
import { CompetitionsInstancesMonsters } from "./entities/competitions-instances-monsters.entity";
import { join } from "path";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: "postgresql://user1:8208150aAa!@rc1a-cd1vstc3dofdrqa0.mdb.yandexcloud.net:6432/db1",
      entities: [UsersAndMonsters, CompetitionsInstancesMonsters],
      synchronize: false, // Для разработки можно установить true
      ssl: {
        rejectUnauthorized: false, // Yandex Cloud использует самоподписанный сертификат
        ca: [
          require("fs").readFileSync(
            join(__dirname, "..", ".postgresql", "root.crt"),
            "utf-8"
          ),
        ],
      },
    }),
    TypeOrmModule.forFeature([UsersAndMonsters, CompetitionsInstancesMonsters]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
