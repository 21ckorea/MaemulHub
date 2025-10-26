import { ContractService } from './contract.service';
export declare class ContractController {
    private readonly service;
    constructor(service: ContractService);
    list(page?: string, pageSize?: string, q?: string, status?: string, type?: string, assignee?: string, startFrom?: string, startTo?: string, sort?: string): Promise<{
        items: any[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    get(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
