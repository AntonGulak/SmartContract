import { ProductModel } from '../../product/model/product.model';
import { ProductOnListDto } from './dto/product-on-list.dto';
import { PriceAssembler } from '../../product/assembler/price.assembler';
import { OwnerAssembler } from '../../user/assembler/owner.assembler';
import { AuthorAssembler } from '../../user/assembler/author.assembler';
import { AuthorOnProductAssembler } from '../../author/assembler/author-on-product.assembler';
import { ImageHelper } from "../../../helper/image.helper";
import { ImageType } from "../../product/vo/image-type.vo";
import { BidAssembler } from '../../bid/assembler/bid.assembler';
import { globals } from "../../../config/globals";
import { ActualizeProductService } from '../../product/service/actualize-product.service';
import { NftTokenRepository, nftTokenRepository } from '../../nft/repository/nft-token.repository';

export class ProductOnListMapper {
    private readonly priceAssembler: PriceAssembler;
    private readonly ownerAssembler: OwnerAssembler;
    private readonly authorAssembler: AuthorAssembler;
    private readonly authorOnProductAssembler: AuthorOnProductAssembler;
    private readonly imageHelper: ImageHelper;
    private readonly bidAssembler: BidAssembler;
    private readonly actualizeProductService: ActualizeProductService;
    private readonly nftTokenRepository: NftTokenRepository;

    constructor() {
        this.priceAssembler = new PriceAssembler();
        this.ownerAssembler = new OwnerAssembler();
        this.authorAssembler = new AuthorAssembler();
        this.authorOnProductAssembler = new AuthorOnProductAssembler();
        this.bidAssembler = new BidAssembler();
        this.imageHelper = new ImageHelper();
        this.actualizeProductService = new ActualizeProductService();
        this.nftTokenRepository = nftTokenRepository;
    }

    async map(productModel: ProductModel): Promise<ProductOnListDto> {
        await this.actualizeProductService.actualize(productModel);
        let walletAddress = '';
        if (productModel.nft_token_id) {
            const nftToken = await this.nftTokenRepository.getOneById(productModel.nft_token_id);
            walletAddress = nftToken.wallet_address;
        }
        return {
            id: productModel.id,
            bid: await this.bidAssembler.assembleByProductModel(productModel),
            name: productModel.name,
            price: await this.priceAssembler.assemble(productModel.price),
            sale_state: productModel.sale_state,
            expire_at: productModel.expire_at,
            image: this.imageHelper.getResizedWebPath(productModel.image, ImageType.LIST_SIZE),
            owner: await this.ownerAssembler.assemble(productModel.owner_id),
            wallet_address: walletAddress,
            // Если мы продукту указали автора, то будет работать взятие оттуда
            // Если продукту ничего не указывали, то старая схема
            // Старый ассемлблер автора в следующем мердже будем удалять
            author: productModel.author_table_id 
                ? await this.authorOnProductAssembler.assemble(productModel.author_table_id)
                : await this.authorAssembler.assemble(productModel.author_id),
            video: productModel.video ? globals.BASE_PATH + productModel.video : null,
            product_type: productModel.type
        }
    }
}
