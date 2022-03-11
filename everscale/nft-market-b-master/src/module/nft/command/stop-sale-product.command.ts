import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { GetProductDto } from '../../product/command/dto/get-product.dto';
import { ProductAssembler } from '../../product/assembler/product.assembler';
import { ProductRepository, productRepository } from '../../product/repository/product.repository';
import { NotFoundError } from '../../../error/not-found.error';
import { StopSaleProductDto } from './dto/stop-sale-product.dto';
import { BidRepository, bidRepository } from '../../bid/repository/bid.repository';
import { OfferRepository, offerRepository } from '../../offer/repository/offer.repository';
import { OfferState } from '../../offer/vo/offer-state.vo';
import { BidState } from '../../bid/vo/bid-state.vo';
import { SaleState } from '../../product/vo/sale-state.vo';

export class StopSaleCommand extends CommandContract {
    private readonly productAssembler: ProductAssembler;
    private readonly productRepository: ProductRepository;
    private readonly bidRepository: BidRepository;
    private readonly offerRepository: OfferRepository;

    constructor() {
        super();
        this.productAssembler = new ProductAssembler();
        this.productRepository = productRepository;
        this.bidRepository = bidRepository;
        this.offerRepository = offerRepository;
    }

    async run(req: Request): Promise<any> {
        const stopSaleProductDto =  <StopSaleProductDto>{...req.body};
        const productModel = await this.productRepository.findOneById(stopSaleProductDto.product_id);
        if (!productModel) {
            throw new NotFoundError('Product not found.');
        }

        // завершаем все текущие аукционы
        await this.offerRepository.updateStateByProductId(stopSaleProductDto.product_id, OfferState.LOSER);

        // Отменяем все текущие ставки на продажу
        await this.bidRepository.updateStateByProductId(stopSaleProductDto.product_id, BidState.STOPPED);

        // Убираем цену у продукта, раз больше не на продаже
        productModel.price = 0;
        productModel.sale_state = SaleState.NO;
        await this.productRepository.update(productModel);

         const productDto = await this.productAssembler.assemble(Number(stopSaleProductDto.product_id));
         return <GetProductDto>{ item: productDto };
    }
}
