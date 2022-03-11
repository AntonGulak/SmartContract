import { ModuleContract } from '../../contract/module.contract';
import { method, Route } from '../../contract/route.contract';
import { AddOfferCommand } from './command/add-offer.command';
import { SaleProductCommand } from './command/sale-product.command';
import { AuctionEndCommand } from './command/auction-end.command';
import { SetToSaleCommand } from './command/set-to-sale-product.command';
import { StopSaleCommand } from './command/stop-sale-product.command';
import { AuctionStopCommand } from './command/auction-stop.command';
import { TouchWalletCommand } from './command/touch-wallet-command';
import { DebotLinksCommand } from './command/debot-links.command';
import { GetDebotLinkCommand } from './command/get-debot-link-command';

export class NftModule implements ModuleContract {
    basePath = '/nft';
    routes: Route[] = [
        {
            method: method.POST,
            path: '/sale_product',
            command: SaleProductCommand,
        },
        {
            method: method.POST,
            path: '/add_offer',
            command: AddOfferCommand,
        },
        {
            method: method.POST,
            path: '/auction_end',
            command: AuctionEndCommand,
        },
        {
            method: method.POST,
            path: '/auction_stop',
            command: AuctionStopCommand,
        },
        {
            method: method.POST,
            path: '/set_to_sale_product',
            command: SetToSaleCommand,
        },
        {
            method: method.POST,
            path: '/stop_sale_product',
            command: StopSaleCommand,
        },
        {
            method: method.GET,
            path: '/touch_wallet/:wallet',
            command: TouchWalletCommand,
        },
        {
            method: method.GET,
            path: '/debot_links',
            command: DebotLinksCommand,
        },
        {
            method: method.GET,
            path: '/get_debot_link',
            command: GetDebotLinkCommand,
        }
    ];
}
