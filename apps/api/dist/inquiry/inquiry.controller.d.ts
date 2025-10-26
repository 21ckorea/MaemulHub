import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
export declare class InquiryController {
    private readonly service;
    constructor(service: InquiryService);
    assignees(): Promise<string[]>;
    list(page?: string, pageSize?: string, q?: string, status?: string, source?: string, assignee?: string, sort?: string): Promise<{
        items: ({
            customer: {
                tags: string[];
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                phone: string | null;
                email: string | null;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.InquiryStatus;
            assignee: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            source: import("@prisma/client").$Enums.InquirySource;
            notes: string | null;
            customerId: string | null;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    get(id: string): Promise<{
        customer: {
            tags: string[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            email: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.InquiryStatus;
        assignee: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        source: import("@prisma/client").$Enums.InquirySource;
        notes: string | null;
        customerId: string | null;
    }>;
    create(input: CreateInquiryDto): Promise<{
        status: import("@prisma/client").$Enums.InquiryStatus;
        assignee: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        source: import("@prisma/client").$Enums.InquirySource;
        notes: string | null;
        customerId: string | null;
    }>;
    update(id: string, input: UpdateInquiryDto): Promise<{
        status: import("@prisma/client").$Enums.InquiryStatus;
        assignee: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        source: import("@prisma/client").$Enums.InquirySource;
        notes: string | null;
        customerId: string | null;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
