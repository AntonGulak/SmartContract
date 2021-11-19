import { CommandContract } from '../../../contract/command.contract';
import { Request } from 'express';
import { productRepository, ProductRepository } from '../../product/repository/product.repository';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductOnListMapper } from '../mapper/product-on-list.mapper';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UserRepository, userRepository } from '../../user/repository/user.repository';
import { NotFoundError } from '../../../error/not-found.error';
import { UserModel } from '../../user/model/user.model';
import { OrderForProductVo } from '../../product/vo/order-for-product.vo';

export class GetProductsCommand extends CommandContract {
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
        const filterProductsDto = <FilterProductsDto>{...req.query};
        const products = await this.productRepository.findAllByParams( await this.getFilterParams(filterProductsDto), new OrderForProductVo(filterProductsDto.order));

        return <GetProductsDto>{
            items: await Promise.all(products.map(this.productOnListMapper.map.bind(this.productOnListMapper))),
        };
    }

    // Добавлено вместо прямой передачи filterProductsDto чтобы избежать попадания в sql запрос лишних параметров
    private async getFilterParams(filterProductsDto: FilterProductsDto):Promise<object>  {
        let filterParams :any = {};
        if (filterProductsDto.owner_id) {
            filterParams.owner_id = filterProductsDto.owner_id;
        }
        if (filterProductsDto.wallet && !filterProductsDto.owner_id) {
            let userWithWallet = await this.userRepository.findOneByWallet(filterProductsDto.wallet) as UserModel;
            if (!userWithWallet) {
                // костыль чтобы уже созданные работали
                userWithWallet = await this.userRepository.findOneByWallet(filterProductsDto.wallet.toUpperCase()) as UserModel;
                if (!userWithWallet) {
                    throw new NotFoundError('Wallet not found.');
                }
            }
            filterParams.owner_id = userWithWallet.id;
        }
        if (filterProductsDto.types) {
            filterParams.type = filterProductsDto.types;
        }
        if (filterProductsDto.sale_states) {
            filterParams.sale_state = filterProductsDto.sale_states;
        }
        if (filterProductsDto.gallery_id) {
            filterParams.gallery_id = filterProductsDto.gallery_id;
        }
        if (filterProductsDto.author_id) {
            filterParams.author_table_id = filterProductsDto.author_id;
        }
        return filterParams;
    }

}
