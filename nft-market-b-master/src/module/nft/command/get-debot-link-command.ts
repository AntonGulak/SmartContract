import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { NotFoundError } from '../../../error/not-found.error';
import { GetDebotMessageService } from '../service/get-debot-message.service';
import { DebotLinkType } from '../type/debot-link.type';
import { GetDebotLinkParamsDto } from './dto/get-debot-link-params.dto';
import { GetDebotLinkDto } from './dto/get-debot-link.dto';

export class GetDebotLinkCommand extends CommandContract {

    private readonly getDebotMessageService: GetDebotMessageService;

    constructor() {
        super();
        this.getDebotMessageService = new GetDebotMessageService();
    }

    async run(req: Request): Promise<any> {
        const debontLinkParamsDto = <GetDebotLinkParamsDto>{...req.query};
        if (!debontLinkParamsDto.product_wallet || !debontLinkParamsDto.debot_type)  {
            throw new NotFoundError('Not enough params');
        }
        const link = await this.getDebotMessageService.get(debontLinkParamsDto.product_wallet, <DebotLinkType>debontLinkParamsDto.debot_type);
        return <GetDebotLinkDto>{
            link: link,
        };
    }
}
