import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MonstertypesController } from "./monstertypes.controller";
import { MonstertypesService } from "./monstertypes.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersAndMonsters } from "./entities/users-and-monsters.entity";
import { CompetitionsInstancesMonsters } from "./entities/competitions-instances-monsters.entity";
import { join } from "path";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL || "postgresql://user1:8208150aAa!@rc1a-cd1vstc3dofdrqa0.mdb.yandexcloud.net:6432/db1",
      entities: [UsersAndMonsters, CompetitionsInstancesMonsters],
      synchronize: false, // Для разработки можно установить true
      ssl: {
        rejectUnauthorized: false, // Yandex Cloud требует SSL но может использовать самоподписанный сертификат
      },
    }),
    TypeOrmModule.forFeature([UsersAndMonsters, CompetitionsInstancesMonsters]),
  ],
  controllers: [AppController, MonstertypesController],
  providers: [AppService, MonstertypesService],
})
export class AppModule {}
