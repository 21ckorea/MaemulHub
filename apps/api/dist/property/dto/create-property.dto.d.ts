export declare enum PropertyTypeDto {
    apartment = "apartment",
    officetel = "officetel",
    store = "store",
    land = "land",
    multifamily = "multifamily",
    villa = "villa"
}
export declare enum DealTypeDto {
    sale = "sale",
    jeonse = "jeonse",
    monthly = "monthly",
    lease = "lease",
    rent = "rent"
}
export declare enum PropertyStatusDto {
    draft = "draft",
    review = "review",
    published = "published",
    in_contract = "in_contract",
    closed = "closed"
}
export declare class CreatePropertyDto {
    type: PropertyTypeDto;
    address: string;
    lat?: number;
    lng?: number;
    complex_name?: string;
    area_supply?: number;
    area_exclusive?: number;
    floor?: number;
    rooms?: number;
    baths?: number;
    built_year?: number;
    parking?: string;
    deal_type?: DealTypeDto;
    price?: number;
    deposit?: number;
    rent?: number;
    available_from?: string;
    maintenance_fee?: number;
    status?: PropertyStatusDto;
    assignee?: string;
    tags?: string[];
    photos?: string[];
}
