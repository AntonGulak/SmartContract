import { CommandContract } from '../../../contract/command.contract';
import { Request } from 'express';
import { productRepository, ProductRepository } from '../../product/repository/product.repository';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductOnListMapper } from '../mapper/product-on-list.mapper';
import { UserRepository, userRepository } from '../../user/repository/user.repository';


export class GetProductsLatestAuctionsCommand extends CommandContract {
    private readonly productOnListMapper: ProductOnListMapper;
    private readonly productRepository: ProductRepository;
    private readonly userRepository: UserRepository;

    constructor() {
        super();
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productOnListMapper = new ProductOnListMapper();
    }

    async run(req: Request): Promise<any> {
        const products = await this.productRepository.findLatestAuctionProducts();

        return <GetProductsDto>{
            items: await Promise.all(products.map(this.productOnListMapper.map.bind(this.productOnListMapper))),
        };
    }


}
