import { AppService } from "./app.service";
type MonsterImpactsRequest = {
    monsterId: number;
};
type MonsterImpact = {
    id: number;
    image: string | null;
    name: string;
    comment: string | null;
    method: string | null;
    energyprice: number | null;
    minendurance: number | null;
    available: boolean | null;
};
type MonsterImpactsResponse = {
    monsterimpacts: MonsterImpact[];
};
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getMonsterImpacts(body: MonsterImpactsRequest): Promise<MonsterImpactsResponse>;
}
export {};
