import { PriceDto } from './price.dto';
import { AuthorDto } from '../../../user/assembler/dto/author.dto';
import { OwnerDto } from '../../../user/assembler/dto/owner.dto';
import { BidDto } from '../../../bid/assembler/dto/bid.dto';

export interface ProductDto {
    id: number;
    bid: BidDto | null;
    name: string;
    description: string;
    price: PriceDto;
    sale_state: string;
    expire_at: string;
    image: string;
    author: AuthorDto;
    owner: OwnerDto;
    wallet_address: string;
    year: number;
    license: number;
    comission_gallery: number;
    comission_author: number;
    comission_author_2: number;
    product_type: string;
    sub_type_info: string;
    gallery_id: number;
    author_id: number;
    video: string | null;
}
