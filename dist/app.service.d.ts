import { DataSource } from "typeorm";
export declare class AppService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private readonly characteristicsFnUrl;
    buildMonsterImpacts(monsterId: number): Promise<{
        id: number;
        image: string;
        name: string;
        comment: string;
        method: string;
        energyprice: number;
        minendurance: number;
        available: boolean | null;
    }[]>;
    private fetchMonsterEndurance;
}
