import { OfferRepository, offerRepository } from "../../offer/repository/offer.repository";
import { PriceAssembler } from "../../product/assembler/price.assembler";
import { ProductModel } from "../../product/model/product.model";
import { SaleState } from "../../product/vo/sale-state.vo";
import { BidModel } from "../model/bid.model";
import { BidRepository, bidRepository } from "../repository/bid.repository";
import { BidType } from "../vo/bid-type.vo";
import { BidDto } from "./dto/bid.dto";

export class BidAssembler {

    private readonly priceAssembler: PriceAssembler;
    private readonly bidRepository: BidRepository;
    private readonly offerRepository: OfferRepository;

    constructor() {
        this.priceAssembler = new PriceAssembler();
        this.bidRepository = bidRepository;
        this.offerRepository = offerRepository;
    }

    async assemble(bid: BidModel): Promise<BidDto> {
        let currentBidPrice : null | number = null ;
        if (bid.type == BidType.AUCTION) {
            const currentOffer = await this.offerRepository.findOneActualByProductId(bid.product_id);
            currentBidPrice = currentOffer ? currentOffer.price_crystal : null;
        }

        return <BidDto>{
            id: bid.id,
            price: await this.priceAssembler.assemble(bid.price_crystal),
            expire_at: bid.expire_at,
            current_bid: currentBidPrice ? await this.priceAssembler.assemble(currentBidPrice) : null
        };
    }

    async assembleByProductModel(productModel: ProductModel ): Promise<BidDto | null>  {
        if (productModel.sale_state == SaleState.NO) {
            return null;
        }
        
        const bid = await this.bidRepository.findOneActualByProductId(productModel.id);
        if (bid) {
            return await this.assemble(bid)
        }

        return <BidDto>{
            id: 0,
            price: await this.priceAssembler.assemble(productModel.price),
            expire_at: productModel.sale_state == SaleState.AUCTION ? productModel.expire_at : null,
            current_bid: productModel.last_offer_price ? await this.priceAssembler.assemble(productModel.last_offer_price) : null
        };
    }

}