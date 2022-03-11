import { ProductDto } from './dto/product.dto';
import { ProductRepository, productRepository } from '../repository/product.repository';
import { NotFoundError } from '../../../error/not-found.error';
import { PriceAssembler } from './price.assembler';
import { OwnerAssembler } from '../../user/assembler/owner.assembler';
import { AuthorAssembler } from '../../user/assembler/author.assembler';
import { AuthorOnProductAssembler } from '../../author/assembler/author-on-product.assembler';
import { BidAssembler } from '../../bid/assembler/bid.assembler';
import { ImageHelper } from "../../../helper/image.helper";
import { ImageType as AuthorImageType} from "../../author/vo/image-type.vo";
import { ImageType as ProductImageType} from "../vo/image-type.vo";
import { globals } from "../../../config/globals";
import { ActualizeProductService } from '../service/actualize-product.service';
import { nftTokenRepository, NftTokenRepository } from '../../nft/repository/nft-token.repository';
import { SaleState } from '../vo/sale-state.vo';
import { BidDto } from '../../bid/assembler/dto/bid.dto';

export class ProductAssembler {
    private readonly productRepository: ProductRepository;
    private readonly priceAssembler: PriceAssembler;
    private readonly ownerAssembler: OwnerAssembler;
    private readonly authorAssembler: AuthorAssembler;
    private readonly authorOnProductAssembler: AuthorOnProductAssembler;
    private readonly imageHelper: ImageHelper;
    private readonly bidAssembler: BidAssembler;
    private readonly actualizeProductService: ActualizeProductService;
    private readonly nftTokenRepository: NftTokenRepository;
    
    constructor() {
        this.productRepository = productRepository;
        this.priceAssembler = new PriceAssembler();
        this.ownerAssembler = new OwnerAssembler();
        this.authorAssembler = new AuthorAssembler();
        this.authorOnProductAssembler = new AuthorOnProductAssembler();
        this.bidAssembler = new BidAssembler();
        this.imageHelper = new ImageHelper();
        this.actualizeProductService = new ActualizeProductService();
        this.nftTokenRepository = nftTokenRepository;
    }

    async assemble(productId: number): Promise<ProductDto> {
        const product = await this.productRepository.findOneById(productId);
        if (!product) {
            throw new NotFoundError('Product not found.');
        }

        await this.actualizeProductService.actualize(product);

        let walletAddress = '';
        if (product.nft_token_id) {
            const nftToken = await this.nftTokenRepository.getOneById(product.nft_token_id);
            walletAddress = nftToken.wallet_address;
        }

        return <ProductDto>{
            id: product.id,
            bid: await this.bidAssembler.assembleByProductModel(product),
            name: product.name,
            description: product.description,
            price: await this.priceAssembler.assemble(product.price),
            sale_state: product.sale_state,
            expire_at: product.expire_at,
            image: this.imageHelper.getResizedWebPath(product.image, ProductImageType.PRODUCT_SIZE),
            // Если мы продукту указали автора, то будет работать взятие оттуда
            // Если продукту ничего не указывали, то старая схема
            // Старый ассемлблер автора в следующем мердже будем удалять
            author: product.author_table_id 
                ? await this.authorOnProductAssembler.assemble(product.author_table_id, AuthorImageType.PRODUCT_SIZE)
                : await this.authorAssembler.assemble(product.author_id, AuthorImageType.PRODUCT_SIZE),
            owner: await this.ownerAssembler.assemble(product.owner_id),
            wallet_address: walletAddress,
            year: product.year,
            license: product.license,
            comission_gallery: product.comission_gallery,
            comission_author: product.comission_author,
            comission_author_2: product.comission_author_2,
            product_type: product.type,
            sub_type_info: product.sub_type_info,
            gallery_id: product.gallery_id,
            video: product.video ? globals.BASE_PATH + product.video : null,
            author_id: product.author_table_id // todo убрать в автора
        };
    }
}
