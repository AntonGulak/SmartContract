import { Account } from "@tonclient/appkit";
import { TonClient } from "@tonclient/core";
import { libNode } from "@tonclient/lib-node";
import { tonDev } from "../../../config/ton_dev";
import { ContractModel } from "../model/contract.model";
import { ContractRepository, contractRepository } from "../repository/contract.repository";
import { DebotLinkRepository, debotLinkRepository } from "../repository/debot_link.repository";
import { ContractType, contractType } from "../type/contract.type";
import { DebotLinkType, debotLinkType } from "../type/debot-link.type";

export class GetDebotMessageService {

    private readonly contractRepository: ContractRepository;
    private readonly debotLinkRepository: DebotLinkRepository;
    private readonly client: TonClient;

    constructor() {
        this.contractRepository = contractRepository;
        this.debotLinkRepository = debotLinkRepository;
        TonClient.useBinaryLibrary(libNode);
        this.client = new TonClient({
            network: {
                endpoints: [tonDev.endpoint]
            }
        });
    }


    public async get(productWallet: string, type: DebotLinkType) {
        const debotLinkModel = await this.debotLinkRepository.getOneByType(type);
        const debotAddress = this.getDebotAddressByDebotLink(debotLinkModel.link);

        const message = await this.getDebotMessage(productWallet, debotAddress, this.getContractTypeByDebotLinkType(<DebotLinkType>debotLinkModel.type));
        return debotLinkModel.link + '&message=' + message;
    }

    private getDebotAddressByDebotLink(link: string) : string {
        const addressStart: number =  link.indexOf('address=') + 8;
        const addressStop = link.indexOf('&', addressStart) > 0 ? link.indexOf('&', addressStart) : link.length;
        return link.substring(addressStart, addressStop);
    }

    private getContractTypeByDebotLinkType(type: DebotLinkType) : ContractType {
        switch(type) {
            case debotLinkType.DebotCreateAuction:  
                return <ContractType>contractType.DebotCreateAuction;
            case debotLinkType.DebotCreateDirectSell:  
                return <ContractType>contractType.DebotCreateDirectSell;
            case debotLinkType.DebotCreateOffer:  
                return <ContractType>contractType.DebotCreateOffer;
            case debotLinkType.DebotDirectBuy:  
                return <ContractType>contractType.DebotDirectBuy;
            case debotLinkType.DebotStopAuction:  
                return <ContractType>contractType.DebotStopAuction;
            case debotLinkType.DebotStopDirectSell:  
                return <ContractType>contractType.DebotStopDirectSell;
            default:
                return <ContractType>null;
        }
    }

    public async getDebotMessage(productWallet: string, debotAddress: string, type: ContractType): Promise<string> {
        const contract: ContractModel = await this.contractRepository.getOneByType(type);
        let result : any;

            const account = new Account({
                abi: contract.abi
            }, {
                client: this.client,
                address: debotAddress,
            });
            result = await account.runLocal('getInvokeMessage', {'nftItem': productWallet});

        return result.decoded?.output.message;
    }
}