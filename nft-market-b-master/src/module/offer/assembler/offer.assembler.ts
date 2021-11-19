import { OfferModel } from "../model/offer.model";
import { OfferDto } from "./dto/offer.dto";

export class OfferAssembler {

    async assemble(offer: OfferModel): Promise<OfferDto> {
        return <OfferDto>{
            id: offer.id,
            user_id: offer.user_id,
            product_id: offer.product_id,
            state: offer.state,
            price_crystal: offer.price_crystal,
            expire_at: offer.expire_at
        };
    }
}