import { Account } from '@tonclient/appkit';
import { TonClient } from '@tonclient/core';
import { libNode } from '@tonclient/lib-node';
import { tonDev } from '../../../config/ton_dev';
import { ContractRepository, contractRepository } from '../repository/contract.repository';
import { contractType, ContractType } from '../type/contract.type';
import { request, gql } from 'graphql-request';
import { TokenInfoDto } from './dto/token-info.dto';
import { DateHelper } from '../../../helper/date.helper';
import { SaleState } from '../../product/vo/sale-state.vo';
import { ContractModel } from '../model/contract.model';

export class GetTokenInfoService {
    private readonly client: TonClient;
    private readonly contractRepository: ContractRepository;
    private readonly dateHelper: DateHelper;

    constructor() {
        TonClient.useBinaryLibrary(libNode);
        this.contractRepository = contractRepository;
        this.dateHelper = new DateHelper();
        this.client = new TonClient({
            network: {
                endpoints: [tonDev.endpoint]
            }
        });
    }

    async get(walletAddress: string): Promise<TokenInfoDto> {
        const notForSale = <TokenInfoDto>{
            saleState: SaleState.NO,
            price: 0,
            expiredAt: '',
            walletOwner: ''
        };

        try {
            const contractDetails = await this.getContractDetails(walletAddress);
            const lendOwnershipInfo = await this.getLendOwnershipInfo(walletAddress);
            
            if (lendOwnershipInfo.finishTime * 1000 < new Date().getTime()) {
                notForSale.walletOwner = contractDetails.walletOwner;
                return notForSale;
            }

            const codeHash = await this.getContractCodeHash(lendOwnershipInfo.ownerAddress);
            const contract: ContractModel = await this.contractRepository.getOneByCodeHash(codeHash);
            
            let resultNft : TokenInfoDto;
            if (contract.type == contractType.Auction) {
                resultNft = await this.getContractAuctionDetails(lendOwnershipInfo, contract);
            }
            else {
                resultNft = await this.getContractSaleDetails(lendOwnershipInfo, contract);
            }
            resultNft.walletOwner = contractDetails.walletOwner;
            return resultNft;

        } catch (e) {
            console.error(e);
            return notForSale;
        } finally {
            this.client.close();
        }

    }

    private async getLendOwnershipInfo(walletAddress: string): Promise<LendOwnership> {
        const walletNftContract = await this.contractRepository.getOneByType(<ContractType>contractType.WalletNFT);
        const account = new Account({
            abi: walletNftContract.abi
        }, {
            client: this.client,
            address: walletAddress,
        });

        const result = await account.runLocal('getLendOwnershipInfo', {});
        return <LendOwnership>{
            ownerAddress: result.decoded?.output.lend_owner_addr,
            finishTime: result.decoded?.output.lend_finish_time,
        };
    }

    private async getContractDetails(walletAddress: string): Promise<ContractDetails> {
        const walletNftContract = await this.contractRepository.getOneByType(<ContractType>contractType.WalletNFT);
        const account = new Account({
            abi: walletNftContract.abi
        }, {
            client: this.client,
            address: walletAddress,
        });

        const result = await account.runLocal('getDetails', {});
        return <ContractDetails>{
            walletOwner: result.decoded?.output.wallet_owner
        };
    }

    private async getContractCodeHash(lendOwnerAddress: string): Promise<string> {
        const query = gql`query{accounts(filter:{id:{eq:"${ lendOwnerAddress }"}}){code_hash}}`;
        const result = await request(tonDev.endpoint, query);
        return result.accounts[0].code_hash;
    }

    private async getContractSaleDetails(lendOwnership: LendOwnership, contract: ContractModel): Promise<TokenInfoDto> {
        const account = new Account({
            abi: contract.abi
        }, {
            client: this.client,
            address: lendOwnership.ownerAddress,
        });

        const result = await account.runLocal('getDetails', {});
        return <TokenInfoDto>{
            price: result.decoded?.output.price / 1_000_000_000,
            saleState: this.getSaleState(contract.type),
            expiredAt: this.dateHelper.timestampToDateTime(lendOwnership.finishTime * 1000),
        };
    }


    private async getContractAuctionDetails(lendOwnership: LendOwnership, contract: ContractModel): Promise<TokenInfoDto> {
        const account = new Account({
            abi: contract.abi
        }, {
            client: this.client,
            address: lendOwnership.ownerAddress,
        });

        // curStakeValue значение последней ставки
        // startValue -минимальное значение для первой ставки

        const result = await account.runLocal('getDetails', {});
        return <TokenInfoDto>{
            price: result.decoded?.output.startValue / 1_000_000_000,
            lastOfferPrice: result.decoded?.output.curStakeValue / 1_000_000_000,
            saleState: this.getSaleState(contract.type),
            expiredAt: this.dateHelper.timestampToDateTime(result.decoded?.output.endUnixtime * 1000),
        };
    }

    private getSaleState(type: string|null): string {
        if (type === contractType.DirectSell) {
            return SaleState.DIRECT_SALE;
        }

        if (type === contractType.Auction) {
            return SaleState.AUCTION;
        }

        return '';
    }
}

interface LendOwnership {
    ownerAddress: string;
    finishTime: number;
}

interface ContractDetails {
    walletOwner: string;
}