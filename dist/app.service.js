"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let AppService = class AppService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.characteristicsFnUrl = "https://monstercharacteristics-production.up.railway.app/characteristics";
    }
    async buildMonsterImpacts(monsterId) {
        try {
            const monsterEndurance = await this.fetchMonsterEndurance(monsterId);
            const baseRows = await this.dataSource.query(`
        SELECT id, buttonimageurl, name, effectdescription, "function", energyprice, minendurance
        FROM impacts
        WHERE base = true
        `);
            const monsterImpacts = baseRows.map((row) => ({
                id: Number(row.id),
                image: row.buttonimageurl,
                name: row.name,
                comment: row.effectdescription,
                method: row.function,
                energyprice: row.energyprice,
                minendurance: row.minendurance,
                available: null,
            }));
            const existingImpactIds = new Set(monsterImpacts.map((i) => i.id));
            const extraIdsRows = await this.dataSource.query(`
        SELECT impactid
        FROM monstersextraimpacts
        WHERE monsterid = $1
        GROUP BY impactid
        HAVING SUM(value) > 0
        `, [monsterId]);
            const extraIds = extraIdsRows
                .map((r) => Number(r.impactid))
                .filter((id) => !existingImpactIds.has(id));
            if (extraIds.length > 0) {
                const extraRows = await this.dataSource.query(`
          SELECT id, buttonimageurl, name, effectdescription, "function", energyprice, minendurance
          FROM impacts
          WHERE id = ANY($1::int[])
          `, [extraIds]);
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
            const historyRows = await this.dataSource.query(`
        SELECT impactid
        FROM monstersimpactshistory
        WHERE monsterid = $1
        ORDER BY id DESC
        LIMIT 3
        `, [monsterId]);
            const recentSet = new Set(historyRows.map((r) => Number(r.impactid)));
            for (const imp of monsterImpacts) {
                if (recentSet.has(imp.id)) {
                    imp.available = false;
                }
            }
            for (const imp of monsterImpacts) {
                if (imp.available === null) {
                    imp.available =
                        imp.minendurance === null ||
                            (typeof imp.minendurance === "number" &&
                                imp.minendurance < monsterEndurance);
                }
            }
            if (monsterImpacts.length === 0) {
                throw new common_1.NotFoundException("Взаимодействия не найдены");
            }
            return monsterImpacts;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.BadGatewayException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException("Внутренняя ошибка сервера");
        }
    }
    async fetchMonsterEndurance(monsterId) {
        const res = await fetch(this.characteristicsFnUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ monsterId }),
        });
        if (!res.ok) {
            throw new common_1.BadGatewayException("Ошибка при вызове внешней функции характеристик монстра");
        }
        const data = await res.json();
        const arr = Array.isArray(data === null || data === void 0 ? void 0 : data.monstercharacteristics)
            ? data.monstercharacteristics
            : [];
        const enduranceObj = arr.find((c) => (c === null || c === void 0 ? void 0 : c.id) === 10012);
        const enduranceVal = enduranceObj && typeof enduranceObj.value === "number"
            ? enduranceObj.value
            : 0;
        return Number(enduranceVal) || 0;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AppService);
//# sourceMappingURL=app.service.js.map