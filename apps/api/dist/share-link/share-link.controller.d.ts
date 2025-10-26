import { ShareLinkService } from './share-link.service';
export declare class ShareLinkController {
    private readonly service;
    constructor(service: ShareLinkService);
    create(body: {
        propertyId: string;
        expiresAt?: string | null;
        password?: string | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        propertyId: string;
        token: string;
        expiresAt: Date | null;
        password: string | null;
    }>;
    listByProperty(propertyId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        propertyId: string;
        token: string;
        expiresAt: Date | null;
        password: string | null;
    }[]>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
    getPublic(token: string): Promise<{
        token: string;
        property: {
            rent: number | null;
            type: import("@prisma/client").$Enums.PropertyType;
            address: string;
            lat: number | null;
            lng: number | null;
            floor: number | null;
            rooms: number | null;
            baths: number | null;
            parking: string | null;
            price: number | null;
            deposit: number | null;
            status: import("@prisma/client").$Enums.PropertyStatus;
            assignee: string | null;
            tags: string[];
            photos: string[];
            id: string;
            complexName: string | null;
            areaSupply: number | null;
            areaExclusive: number | null;
            builtYear: number | null;
            dealType: import("@prisma/client").$Enums.DealType | null;
            availableFrom: Date | null;
            maintenanceFee: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
        expiresAt: Date | null;
    }>;
}
