import { PriceDto } from './dto/price.dto';
import { ConvertNftToUsdService } from '../service/convert-nft-to-usd.service';

export class PriceAssembler {
    private readonly convertNftToUsdService: ConvertNftToUsdService;

    constructor() {
        this.convertNftToUsdService = new ConvertNftToUsdService();
    }

    async assemble(nftPrice: number): Promise<PriceDto> {
        return <PriceDto>{
            nft: Number(nftPrice),
            usd: await this.convertNftToUsdService.convert(nftPrice),
        };
    }
}
