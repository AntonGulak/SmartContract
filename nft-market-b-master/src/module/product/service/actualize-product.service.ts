import { GetTokenInfoService } from '../../nft/service/get-token-info.service';
import { nftTokenRepository, NftTokenRepository } from '../../nft/repository/nft-token.repository';
import { ProductModel } from '../model/product.model';
import { productRepository, ProductRepository } from '../repository/product.repository';
import { WalletService } from '../../user/service/wallet.service';

export class ActualizeProductService {
    private readonly getTokenInfoService: GetTokenInfoService;
    private readonly nftTokenRepository: NftTokenRepository;
    private readonly productRepository: ProductRepository;
    private readonly walletService: WalletService;

    constructor() {
        this.getTokenInfoService = new GetTokenInfoService();
        this.nftTokenRepository = nftTokenRepository;
        this.productRepository = productRepository;
        this.walletService = new WalletService();
    }

    async actualize(product: ProductModel): Promise<void> {
        if (product.nft_token_id) {
            const token = await this.nftTokenRepository.getOneById(product.nft_token_id);
            const tokenInfo = await this.getTokenInfoService.get(token.wallet_address);

            let needToUpdateProduct = false;
            if (product.price != tokenInfo.price) {
                needToUpdateProduct = true;
                product.price = tokenInfo.price;
            }

            if (tokenInfo.expiredAt && product.expire_at != tokenInfo.expiredAt) {
                needToUpdateProduct = true;
                product.expire_at = tokenInfo.expiredAt;
            }

            if (product.sale_state != tokenInfo.saleState) {
                needToUpdateProduct = true;
                product.sale_state = tokenInfo.saleState;
            }

            if (tokenInfo.walletOwner) {
                const owner = await this.walletService.getOrCreateUser(tokenInfo.walletOwner);
                if (owner.id != product.owner_id) {
                    needToUpdateProduct = true;
                    product.owner_id = owner.id;
                }
            }

            if (needToUpdateProduct) {
                this.productRepository.update(product).catch(e => {
                    console.error(
                        `Could not actualize product ${ product.id }.\n` +
                        `Origin error: ${ e.message }.\n`,
                        `New values: ${ JSON.stringify(tokenInfo) }.`);
                });
            }

            // костыльно, но время не терпит
            product.expire_at = tokenInfo.expiredAt;
            product.last_offer_price = tokenInfo.lastOfferPrice ? tokenInfo.lastOfferPrice : 0;

        }
    }
}
