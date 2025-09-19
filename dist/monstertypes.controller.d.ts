import { Response } from 'express';
import { MonstertypesService } from './monstertypes.service';
export declare class MonstertypesController {
    private readonly service;
    constructor(service: MonstertypesService);
    health(res: Response): Promise<Response<any, Record<string, any>>>;
    getMonstertypes(res: Response): Promise<Response<any, Record<string, any>>>;
}
