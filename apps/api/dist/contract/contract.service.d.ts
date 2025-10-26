import { PrismaService } from '../prisma/prisma.service';
export declare class ContractService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private serialize;
    list(params: {
        page?: number;
        pageSize?: number;
        q?: string;
        status?: string;
        type?: string;
        assignee?: string;
        startFrom?: string;
        startTo?: string;
        sort?: string;
    }): Promise<{
        items: any[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    get(id: string): Promise<any>;
    create(input: any): Promise<any>;
    update(id: string, input: any): Promise<any>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
