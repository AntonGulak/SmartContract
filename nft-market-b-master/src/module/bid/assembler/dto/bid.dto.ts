import { PriceDto } from "../../../product/assembler/dto/price.dto";

export interface BidDto {
    id: number;
    price: PriceDto;
    expire_at: string | null;
    current_bid: PriceDto | null;
}