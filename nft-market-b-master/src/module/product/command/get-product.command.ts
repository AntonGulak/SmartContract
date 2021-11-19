import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { GetProductDto } from './dto/get-product.dto';
import { ProductAssembler } from '../assembler/product.assembler';
import { OfferRepository, offerRepository } from '../../offer/repository/offer.repository';
import { OfferAssembler } from '../../offer/assembler/offer.assembler';
import { SaleRepository, saleRepository } from '../../sale/repository/sale.repository';
import { SaleAssembler } from '../../sale/assembler/sale.assembler';

export class GetProductCommand extends CommandContract {
    private readonly productAssembler: ProductAssembler;
    private readonly offerRepository: OfferRepository;
    private readonly offerAssembler: OfferAssembler;
    private readonly saleRepository: SaleRepository;
    private readonly saleAssembler: SaleAssembler;

    constructor() {
        super();
        this.productAssembler = new ProductAssembler();
        this.offerRepository = offerRepository;
        this.offerAssembler = new OfferAssembler();
        this.saleRepository = saleRepository;
        this.saleAssembler = new SaleAssembler();
    }

    async run(req: Request): Promise<any> {
        const productId = Number(req.params.id);
        const productDto = await this.productAssembler.assemble(productId);

        const offersModelsList = await this.offerRepository.findAllByProductId(productId);
        const offersDtoList = await Promise.all(offersModelsList.map(this.offerAssembler.assemble.bind(this.offerAssembler)));

        const salesModelsList = await this.saleRepository.findAllByProductId(productId);
        const salesDtoList = await Promise.all(salesModelsList.map(this.saleAssembler.assemble.bind(this.saleAssembler)));

        return <GetProductDto>{ 
            item: productDto,
            offers: offersDtoList,
            sales: salesDtoList
        };
    }
}
