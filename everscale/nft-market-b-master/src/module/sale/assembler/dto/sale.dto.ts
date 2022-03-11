import { OwnerDto } from '../../../user/assembler/dto/owner.dto';
import { PriceDto } from '../../../product/assembler/dto/price.dto';

export interface SaleDto {
    id: number;
    price: PriceDto;
    operation: string;
    seller: OwnerDto;
    buyer: OwnerDto;
    item_id: number;
    created_at: string;
}