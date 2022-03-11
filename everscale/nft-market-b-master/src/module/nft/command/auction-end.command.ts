import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { NotFoundError } from '../../../error/not-found.error';
import { OfferRepository, offerRepository } from '../../offer/repository/offer.repository';
import { AuctionWinningService } from '../../offer/service/auction-winning.service';
import { SaleAssembler } from '../../sale/assembler/sale.assembler';
import { AuctionEndDto } from './dto/auction-end.dto';
import { GetSaleDto } from './dto/get-sale.dto';

export class AuctionEndCommand extends CommandContract {

    private readonly offerRepository: OfferRepository;
    private readonly auctionWinningService: AuctionWinningService;
    private readonly saleAssembler: SaleAssembler;

    constructor() {
        super();
        this.offerRepository = offerRepository;
        this.auctionWinningService = new AuctionWinningService();
        this.saleAssembler = new SaleAssembler();
    }
    
    async run(req: Request): Promise<any> {
        const auctionEndDto = <AuctionEndDto>{...req.body};
        const offer = await this.offerRepository.findOneById(Number(auctionEndDto.offer_id));
        if (!offer){
           throw new NotFoundError('Offer not found.');
        }

        const soldModel = await this.auctionWinningService.winAuction(offer);

        const saleDto = await this.saleAssembler.assemble(soldModel);
        return <GetSaleDto>{ item: saleDto };
    }
}