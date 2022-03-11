import { BidRepository, bidRepository } from "../../bid/repository/bid.repository";
import { ProductModel } from "../../product/model/product.model";
import { ProductRepository, productRepository } from "../../product/repository/product.repository";
import { SaleModel } from "../../sale/model/sale.model";
import { CreateSaleService } from "../../sale/service/create-sale.service";
import { OfferModel } from "../model/offer.model";
import { OfferRepository, offerRepository } from "../repository/offer.repository";
import { OfferState } from "../vo/offer-state.vo";
import { BidState } from "../../bid/vo/bid-state.vo";
import { SaleState } from "../../product/vo/sale-state.vo";
import { NotifyAuctionActionService } from "./notify-auction-action.service";

export class AuctionWinningService {
    
    private readonly offerRepository: OfferRepository;
    private readonly saleService: CreateSaleService;
    private readonly bidRepository: BidRepository;
    private readonly productRepository: ProductRepository;
    private readonly notifyAuctionActionService: NotifyAuctionActionService;

    constructor() {
        this.offerRepository = offerRepository;
        this.saleService = new CreateSaleService();
        this.bidRepository = bidRepository;
        this.productRepository = productRepository;
        this.notifyAuctionActionService = new NotifyAuctionActionService();
    }

    async winAuction(offer: OfferModel) :Promise<SaleModel> {
        await this.offerRepository.updateStateByOfferId(offer.id, OfferState.WINNER);
        await this.offerRepository.updateStateByProductIdAndExludingOfferId(offer.product_id, offer.id, OfferState.LOSER);
        // Раз аукцион закончился, значит надо отменить выставление на продажу
        await this.bidRepository.updateStateByProductId(offer.product_id, BidState.STOPPED);
        const sale = await this.saleService.createSaleByOffer(offer);

        // Проставляем нового владельца продукта
        const productModel = await this.productRepository.findOneById(offer.product_id) as ProductModel;
        const prevOwnerId = productModel.owner_id;
        productModel.owner_id = offer.user_id;
        productModel.price = 0; // продукт не на продаже так что цена снова 0
        productModel.sale_state = SaleState.NO;
        await this.productRepository.update(productModel);
        await this.notifyAuctionActionService.notifyOwnerSold(prevOwnerId, productModel.id);
        await this.notifyAuctionActionService.notifyBuyerWin(offer.user_id, productModel.id);
        return sale;
    }

    // Если нет победителя
    async stopAuction(productId: number): Promise<void> {
        await this.offerRepository.updateStateByProductId(productId, OfferState.LOSER);
        // Раз аукцион закончился, значит надо отменить выставление на продажу
        await this.bidRepository.updateStateByProductId(productId, BidState.STOPPED);

        // Обнуляем цену, так как не на продаже
        const productModel = await this.productRepository.findOneById(productId) as ProductModel;
        productModel.price = 0; // продукт не на продаже так что цена снова 0
        productModel.sale_state = SaleState.NO;
        await this.productRepository.update(productModel);
        await this.notifyAuctionActionService.notifyOwnerStop(productModel.owner_id, productModel.id);
    }
}