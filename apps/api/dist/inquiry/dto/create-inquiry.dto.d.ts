export declare enum InquirySourceDto {
    web = "web",
    phone = "phone",
    referral = "referral",
    kakao = "kakao"
}
export declare enum InquiryStatusDto {
    new = "new",
    in_progress = "in_progress",
    closed = "closed"
}
export declare class CreateInquiryDto {
    title: string;
    source: InquirySourceDto;
    status?: InquiryStatusDto;
    assignee?: string;
    notes?: string;
    customerId?: string;
}
