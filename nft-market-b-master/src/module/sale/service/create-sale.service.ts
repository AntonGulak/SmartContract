import { OfferModel } from "../../offer/model/offer.model";
import { ProductModel } from "../../product/model/product.model";
import { ProductRepository, productRepository } from "../../product/repository/product.repository";
import { SaleModel } from "../model/sale.model";
import { SaleRepository, saleRepository } from "../repository/sale.repository";
import { SaleOperation } from "../vo/sale-operation.vo";

export class CreateSaleService {

    private readonly productRepository: ProductRepository;
    private readonly saleRepository: SaleRepository;
    constructor() {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
    }

    async createSaleByOffer(offer: OfferModel): Promise<SaleModel> {
        const product = await this.productRepository.findOneById(offer.product_id) as ProductModel;
        
        const saleModel = <SaleModel> {
            seller_id: product.owner_id,
            buyer_id: offer.user_id,
            price: offer.price_crystal,
            item_id: product.id,
            operation: SaleOperation.AUCTION
        };
        const soldModel = await this.saleRepository.insert(saleModel);
        return soldModel;
    }
}