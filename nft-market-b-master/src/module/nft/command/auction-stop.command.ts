import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { NotFoundError } from '../../../error/not-found.error';
import { AuctionWinningService } from '../../offer/service/auction-winning.service';
import { ProductRepository, productRepository } from '../../product/repository/product.repository';
import { SaleAssembler } from '../../sale/assembler/sale.assembler';
import { AuctionStopDto } from './dto/auction-stop.dto';

export class AuctionStopCommand extends CommandContract {

    private readonly productRepository: ProductRepository;
    private readonly auctionWinningService: AuctionWinningService;
    private readonly saleAssembler: SaleAssembler;

    constructor() {
        super();
        this.productRepository = productRepository;
        this.auctionWinningService = new AuctionWinningService();
        this.saleAssembler = new SaleAssembler();
    }
    
    async run(req: Request): Promise<any> {
        const auctionStopDto = <AuctionStopDto>{...req.body};
        const product = await this.productRepository.findOneById(Number(auctionStopDto.product_id));
        if (!product){
           throw new NotFoundError('Product not found.');
        }

        await this.auctionWinningService.stopAuction(auctionStopDto.product_id);

        return ;
    }
}