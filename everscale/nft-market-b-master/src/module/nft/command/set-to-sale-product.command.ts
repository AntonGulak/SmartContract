import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { GetProductDto } from '../../product/command/dto/get-product.dto';
import { ProductAssembler } from '../../product/assembler/product.assembler';
import { ProductRepository, productRepository } from '../../product/repository/product.repository';
import { NotFoundError } from '../../../error/not-found.error';
import { ServerErrorError } from '../../../error/server-error.error';
import { SetToSaleDto } from './dto/set-to-sale.dto';
import { BidModel } from '../../bid/model/bid.model';
import { BidRepository, bidRepository } from '../../bid/repository/bid.repository';
import { BidState } from '../../bid/vo/bid-state.vo';


export class SetToSaleCommand extends CommandContract {
    private readonly productAssembler: ProductAssembler;
    private readonly productRepository: ProductRepository;
    private readonly bidRepository: BidRepository;

    constructor() {
        super();
        this.productAssembler = new ProductAssembler();
        this.productRepository = productRepository;
        this.bidRepository = bidRepository;
    }

    async run(req: Request): Promise<any> {
        const setToSaleDto =  <SetToSaleDto>{...req.body};
        const productModel = await this.productRepository.findOneById(setToSaleDto.product_id);
        if (!productModel) {
            throw new NotFoundError('Product not found.');
        }
        const existBid = await this.bidRepository.findOneActualByProductId(setToSaleDto.product_id);
        if (existBid) {
            throw new ServerErrorError(`Can't set to sale. The product is already on sale.`);
        }

        // todo - сделать правильно
        const userId = productModel.owner_id;

        const bidModel = <BidModel> {
            product_id: setToSaleDto.product_id,
            price_crystal: setToSaleDto.price,
            type: setToSaleDto.sale_type,
            user_id: userId,
            expire_at: setToSaleDto.expire_at,
            state: BidState.ACTUAL
        };

        await this.bidRepository.insert(bidModel);

        // кэшируем цену в продукте
        productModel.price = bidModel.price_crystal;
        productModel.sale_state = bidModel.type;
        this.productRepository.update(productModel);
        
        const productDto = await this.productAssembler.assemble(Number(setToSaleDto.product_id));
        return <GetProductDto>{ item: productDto };
    }
}
