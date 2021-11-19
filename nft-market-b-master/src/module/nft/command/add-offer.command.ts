import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { NotFoundError } from '../../../error/not-found.error';
import { ProductRepository, productRepository } from '../../product/repository/product.repository';
import { WalletService } from '../../user/service/wallet.service';
import { OfferAssembler } from '../../offer/assembler/offer.assembler';
import { OfferModel } from '../../offer/model/offer.model';
import { OfferRepository, offerRepository } from '../../offer/repository/offer.repository';
import { AddOfferDto } from './dto/add-offer.dto';
import { GetOfferDto } from './dto/get-offer.dto';
import { NotifyOfferActionService } from "../service/notify-offer-action.service";

export class AddOfferCommand extends CommandContract {

    private readonly offerRepository: OfferRepository;
    private readonly offerAssembler: OfferAssembler;
    private readonly walletService: WalletService;
    private readonly productRepository: ProductRepository;
    private readonly notifyOfferActionService: NotifyOfferActionService;

    constructor() {
        super();
        this.offerRepository = offerRepository;
        this.productRepository = productRepository;
        this.offerAssembler = new OfferAssembler();
        this.walletService = new WalletService();
        this.notifyOfferActionService = new NotifyOfferActionService();
    }
    
    async run(req: Request): Promise<any> {
        const addOfferDto = <AddOfferDto>{...req.body};
        const product = await this.productRepository.findOneById(Number(addOfferDto.product_id));
        if (!product){
           throw new NotFoundError('Product not found.');
        }
        const buyer = await this.walletService.getOrCreateUser(addOfferDto.wallet);
            
        const offerModel = <OfferModel> {
            product_id: addOfferDto.product_id,
            price_crystal: addOfferDto.price,
            user_id: buyer.id
        };

        const createdOffer = await this.offerRepository.insert(offerModel);  
        
        // кэшируем цену в продукте
        product.price = offerModel.price_crystal;
        this.productRepository.update(product);

        const createdOfferDto = await this.offerAssembler.assemble(createdOffer);
        await this.notifyOfferActionService.notifyOwnerNew(product.id, offerModel.price_crystal, product.owner_id);

        return <GetOfferDto>{ item: createdOfferDto };
    }
}