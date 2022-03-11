import { DebotLinkModel } from '../model/debot-link.model';
import { DebotLinkOnListDto } from './dto/debot-link-on-list.dto';

export class DebotLinkOnListMapper {

    async map(debotOnLinkModel: DebotLinkModel): Promise<DebotLinkOnListDto> {
        return {
            id: debotOnLinkModel.id,
            type: debotOnLinkModel.type,
            link: debotOnLinkModel.link,
            qr_link: debotOnLinkModel.qr_link
        }
    }
}
