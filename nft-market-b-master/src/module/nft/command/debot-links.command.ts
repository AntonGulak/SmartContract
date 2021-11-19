import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { debotLinkRepository, DebotLinkRepository } from '../repository/debot_link.repository';
import {GetDebotListDto} from './dto/get-debot-links.dto'
import { DebotLinkOnListMapper } from '../mapper/debot-link-on-list.mapper';

export class DebotLinksCommand extends CommandContract {

    private readonly debotLinkRepository: DebotLinkRepository;
    private readonly debotLinkOnListMapper: DebotLinkOnListMapper;

    constructor() {
        super();
        this.debotLinkRepository = debotLinkRepository;
        this.debotLinkOnListMapper = new DebotLinkOnListMapper();
    }

    async run(req: Request): Promise<any> {
        const debotLinks = await this.debotLinkRepository.findAll();
        
        return <GetDebotListDto>{
            items: await Promise.all(debotLinks.map(this.debotLinkOnListMapper.map.bind(this.debotLinkOnListMapper))),
        };
    }
}
