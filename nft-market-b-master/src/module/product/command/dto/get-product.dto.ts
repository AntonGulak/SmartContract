import { OfferOnListDto } from '../../../offer/assembler/dto/offer-on-list.dto';
import { SaleOnListDto } from '../../../sale/assembler/dto/sale-on-list.dto';
import { ProductDto } from '../../assembler/dto/product.dto';

export interface GetProductDto {
    item: ProductDto;
    offers: OfferOnListDto[];
    sales: SaleOnListDto[];
}