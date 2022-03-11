import { SaleDto } from './dto/sale.dto';
import { OwnerAssembler } from '../../user/assembler/owner.assembler';
import { SaleModel } from '../model/sale.model';
import { PriceAssembler } from '../../product/assembler/price.assembler';

export class SaleAssembler {
    private readonly ownerAssembler: OwnerAssembler;
    private readonly priceAssembler: PriceAssembler;

    constructor() {
        this.ownerAssembler = new OwnerAssembler();
        this.priceAssembler = new PriceAssembler();
    }

    async assemble(saleModel: SaleModel): Promise<SaleDto> {
        return <SaleDto>{
            id: saleModel.id,
            price: await this.priceAssembler.assemble(saleModel.price),
            seller: await this.ownerAssembler.assemble(saleModel.seller_id),
            buyer: await this.ownerAssembler.assemble(saleModel.buyer_id),
            item_id: saleModel.item_id,
            operation: saleModel.operation,
            created_at: saleModel.created_at
        };
    }
}
