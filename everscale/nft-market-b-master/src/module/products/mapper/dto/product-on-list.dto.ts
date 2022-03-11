import { BidDto } from '../../../bid/assembler/dto/bid.dto';
import { PriceDto } from '../../../product/assembler/dto/price.dto';
import { AuthorDto } from '../../../user/assembler/dto/author.dto';
import { OwnerDto } from '../../../user/assembler/dto/owner.dto';

export interface ProductOnListDto {
    id: number;
    bid: BidDto | null;
    name: string;
    price: PriceDto;
    sale_state: string;
    expire_at: string;
    image: string;
    author: AuthorDto;
    owner: OwnerDto;
    video: string | null;
    product_type: string;
    wallet_address: string;
}
