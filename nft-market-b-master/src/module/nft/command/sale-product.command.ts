import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { NotFoundError } from '../../../error/not-found.error';
import { BidRepository, bidRepository } from '../../bid/repository/bid.repository';
import { BidState } from '../../bid/vo/bid-state.vo';
import { productRepository, ProductRepository } from '../../product/repository/product.repository';
import { SaleState } from '../../product/vo/sale-state.vo';
import { SaleAssembler } from '../../sale/assembler/sale.assembler';
import { SaleModel } from '../../sale/model/sale.model';
import { SaleRepository, saleRepository } from '../../sale/repository/sale.repository';
import { WalletService } from '../../user/service/wallet.service';
import { GetSaleDto } from './dto/get-sale.dto';
import { SaleProductDto } from './dto/sale-product.dto';

export class SaleProductCommand extends CommandContract {

    private readonly productRepository: ProductRepository;
    private readonly saleRepository: SaleRepository;
    private readonly saleAssembler: SaleAssembler;
    private readonly walletService: WalletService;
    private readonly bidRepository: BidRepository;

    constructor() {
        super();
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.saleAssembler = new SaleAssembler();
        this.walletService = new WalletService();
        this.bidRepository = bidRepository;
    }

    async run(req: Request): Promise<any> {
        const saleProductDto = <SaleProductDto>{...req.body};
        const productModel = await this.productRepository.findOneById(saleProductDto.product_id);
        if (!productModel) {
            throw new NotFoundError('Product not found.');
        }
        const buyer = await this.walletService.getOrCreateUser(saleProductDto.wallet);
        
        //todo проверка на то, что не сам у себя покупает, возможно излишняя
        const saleModel = <SaleModel> {
            seller_id: productModel.owner_id,
            buyer_id: buyer.id,
            price: saleProductDto.price,
            item_id: productModel.id
        };
        const soldModel = await this.saleRepository.insert(saleModel);

        // Раз продукт продали, значит надо отменить его выставление на продажу
        await this.bidRepository.updateStateByProductId(productModel.id, BidState.STOPPED);

        productModel.owner_id = buyer.id;
        productModel.price = 0;
        productModel.sale_state = SaleState.NO;
        await this.productRepository.update(productModel);

        const saleDto = await this.saleAssembler.assemble(soldModel);
        return <GetSaleDto>{ item: saleDto };
    }
}
