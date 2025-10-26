import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomerController {
    private readonly service;
    constructor(service: CustomerService);
    list(page?: string, pageSize?: string, q?: string, sort?: string): Promise<{
        items: {
            tags: string[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            email: string | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    get(id: string): Promise<{
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
    }>;
    create(input: CreateCustomerDto): Promise<{
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
    }>;
    update(id: string, input: UpdateCustomerDto): Promise<{
        tags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
