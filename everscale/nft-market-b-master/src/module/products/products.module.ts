import { ModuleContract } from '../../contract/module.contract';
import { method, Route } from '../../contract/route.contract';
import { GetProductsLatestAuctionsCommand } from './command/get-products-latest-auctions.command';
import { GetProductsLatestSallingCommand } from './command/get-products-latest-salling.command';
import { GetProductsCommand } from './command/get-products.command';

export class ProductsModule implements ModuleContract {
    basePath = '/products';
    routes: Route[] = [
        {
            method: method.GET,
            path: '',
            command: GetProductsCommand,
        },
        {
            method: method.GET,
            path: '/latest_auctions',
            command: GetProductsLatestAuctionsCommand,
        },
        {
            method: method.GET,
            path: '/latest_salling',
            command: GetProductsLatestSallingCommand,
        }
    ];
}
