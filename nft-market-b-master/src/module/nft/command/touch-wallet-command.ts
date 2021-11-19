import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { WalletService } from '../../user/service/wallet.service';
import { GetUserDto } from './dto/get-user.dto';

export class TouchWalletCommand extends CommandContract {

    private readonly walletService: WalletService;

    constructor() {
        super();
        this.walletService = new WalletService();
    }

    async run(req: Request): Promise<any> {
        const wallet: string  = req.params.wallet ;
        const user = await this.walletService.getOrCreateUser(wallet);

        return <GetUserDto>{ user_id: user.id };
    }
}
