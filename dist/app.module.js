"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_and_monsters_entity_1 = require("./entities/users-and-monsters.entity");
const competitions_instances_monsters_entity_1 = require("./entities/competitions-instances-monsters.entity");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                url: "postgresql://user1:8208150aAa!@rc1a-cd1vstc3dofdrqa0.mdb.yandexcloud.net:6432/db1",
                entities: [users_and_monsters_entity_1.UsersAndMonsters, competitions_instances_monsters_entity_1.CompetitionsInstancesMonsters],
                synchronize: false,
                ssl: {
                    rejectUnauthorized: false,
                    ca: [
                        require("fs").readFileSync((0, path_1.join)(__dirname, "..", ".postgresql", "root.crt"), "utf-8"),
                    ],
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([users_and_monsters_entity_1.UsersAndMonsters, competitions_instances_monsters_entity_1.CompetitionsInstancesMonsters]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map