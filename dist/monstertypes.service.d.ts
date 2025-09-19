import { OnModuleDestroy } from '@nestjs/common';
import { Monstertype } from './types';
export declare class MonstertypesService implements OnModuleDestroy {
    private pool;
    constructor();
    onModuleDestroy(): Promise<void>;
    getAll(): Promise<Monstertype[]>;
}
