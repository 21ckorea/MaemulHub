import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum InquirySourceDto {
  web = 'web',
  phone = 'phone',
  referral = 'referral',
  kakao = 'kakao',
}

export enum InquiryStatusDto {
  new = 'new',
  in_progress = 'in_progress',
  closed = 'closed',
}

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(InquirySourceDto)
  source!: InquirySourceDto;

  @IsOptional()
  @IsEnum(InquiryStatusDto)
  status?: InquiryStatusDto;

  @IsOptional()
  @IsString()
  assignee?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  customerId?: string;
}
