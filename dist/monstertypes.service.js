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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonstertypesService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
let MonstertypesService = class MonstertypesService {
    constructor() {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            const err = new Error('DATABASE_URL is not set');
            err.code = 'DB_CONNECT_ERROR';
            throw err;
        }
        const caPath = process.env.PGSSLROOTCERT ||
            path.resolve(process.cwd(), '.postgresql', 'root.crt');
        if (!fs.existsSync(caPath)) {
            throw new Error(`PostgreSQL root CA not found at ${caPath}. Put CA to ./.postgresql/root.crt or set PGSSLROOTCERT`);
        }
        const ca = fs.readFileSync(caPath, 'utf-8');
        this.pool = new pg_1.Pool({
            connectionString: databaseUrl,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
            ssl: { ca, rejectUnauthorized: true }
        });
        this.pool.on('error', (err) => {
            console.error('Database pool error:', err);
        });
    }
    async onModuleDestroy() {
        await this.pool.end().catch(() => void 0);
    }
    async getAll() {
        const sql = 'SELECT number, name, activity, image, price FROM monstertypes ORDER BY number ASC';
        const { rows } = await this.pool.query(sql);
        const monstertypes = [];
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
};
exports.MonstertypesService = MonstertypesService;
exports.MonstertypesService = MonstertypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MonstertypesService);
//# sourceMappingURL=monstertypes.service.js.map