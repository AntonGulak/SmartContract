import { libNode } from '@tonclient/lib-node';
import { signerKeys, TonClient } from '@tonclient/core';
import { Account } from '@tonclient/appkit';
import * as fs from 'fs';
import * as path from 'path';
import { ParamsDto } from './dto/params.dto';
import { SignKey } from './dto/sign-key.dto';
import { tonDev } from '../../../config/ton_dev';
import * as giverDev from '../../../config/nft/wallet/giver.dev1';
import { ServerErrorError } from '../../../error/server-error.error';
import { globals } from '../../../config/globals';
import { contractRepository, ContractRepository } from '../repository/contract.repository';
import { ContractType, contractType } from '../type/contract.type';
import { ContractModel } from '../model/contract.model';
import { NftTokenModel } from '../model/nft-token.model';
import { nftTokenRepository, NftTokenRepository } from '../repository/nft-token.repository';

const SEED_PHRASE_WORD_COUNT = 12;
const SEED_PHRASE_DICTIONARY_ENGLISH = 1;
const HD_PATH = "m/44'/396'/0'/0/0";
const ROOT_BALANCE = 2;
const WALLET_BALANCE = 1.3;
const ROOT_NFT = globals.APP_ROOT + '/src/config/nft';

export class CreateTokenService {
    private readonly client: TonClient;
    private readonly contractRepository: ContractRepository;
    private readonly nftTokenRepository: NftTokenRepository;

    constructor() {
        this.contractRepository = contractRepository;
        this.nftTokenRepository = nftTokenRepository;
        TonClient.useBinaryLibrary(libNode);
        this.client = new TonClient({
            network: {
                endpoints: [tonDev.endpoint]
            }
        });
    }

    async create(params: ParamsDto): Promise<number|null> {
        try {
            const rootNftContract = await contractRepository.getOneByType(<ContractType>contractType.RootNFT);
            const phrase = await this.generateSeedPhrase();
            const signKey = await this.deriveSignKeys(phrase);
            const rootAccount = this.createRootAccount(signKey, rootNftContract);
            const address = await rootAccount.getAddress();
            const giverAccount = await this.createGiverAccount();
            await this.sendCrystals(giverAccount, address, ROOT_BALANCE);

            await this.deploy(rootAccount, signKey, params);
            const totalSupply = await this.getTotalSupply(rootAccount);
            const walletAddress = await this.getWalletAddress(rootAccount, totalSupply + 1);
            await this.sendCrystals(giverAccount, walletAddress, WALLET_BALANCE);
            await this.deployWallet(rootNftContract, address, signKey, params);
            const contractId = await this.getContractId(walletAddress);

            const nftToken = <NftTokenModel>{
                phrase,
                public_key: signKey.public,
                secret_key: signKey.secret,
                address,
                wallet_address: walletAddress,
                contract_id: contractId,
            };

            const createdNftToken = await this.nftTokenRepository.insert(nftToken);
            return Number(createdNftToken.id);
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            this.client.close();
        }
    }

    private async generateSeedPhrase(): Promise<string> {
        const { crypto } = this.client;
        const { phrase } = await crypto.mnemonic_from_random({
            dictionary: SEED_PHRASE_DICTIONARY_ENGLISH,
            word_count: SEED_PHRASE_WORD_COUNT,
        });
        return phrase;
    }

    private async deriveSignKeys(seedPhrase: string): Promise<SignKey> {
        const { crypto } = this.client;
        const signKey = await crypto.mnemonic_derive_sign_keys({
            phrase: seedPhrase,
            path: HD_PATH,
            dictionary: SEED_PHRASE_DICTIONARY_ENGLISH,
            word_count: SEED_PHRASE_WORD_COUNT,
        });
        return <SignKey>signKey;
    }

    private createRootAccount(signKey: SignKey, rootNfContract: ContractModel): Account {
        return new Account({
            abi: rootNfContract.abi,
            tvc: rootNfContract.tvc_base64,
        }, {
            signer: signerKeys(signKey),
            client: this.client,
        });
    }

    private async createGiverAccount(): Promise<Account> {
        const safeMultisigWallet = await this.contractRepository.getOneByType(<ContractType>contractType.SafeMultisigWallet);
        return new Account({
            abi: safeMultisigWallet.abi,
        }, {
            signer: signerKeys(giverDev.key),
            address: giverDev.addr,
            client: this.client,
        });
    }

    private async sendCrystals(giverAccount: Account, address: string, count: number): Promise<void> {
        const result = await giverAccount.run("submitTransaction", {
            dest: address,
            value: count * 1_000_000_000,
            bounce: false,
            allBalance: false,
            payload: '',
        });

        if (result.transaction.status !== 3) {
            console.error('Could not send crystals.', result);
            throw new ServerErrorError();
        }
    }

    private async deploy(rootAccount: Account, signKey: SignKey, params: ParamsDto) {
        const walletCode = await fs.promises.readFile(path.resolve(ROOT_NFT + '/WalletCode'));
        const result = await rootAccount.deploy({
            initInput: {
                name: CreateTokenService.toAscii(params.name),
                symbol: CreateTokenService.toAscii(params.symbol),
                root_public_key: `0x${ signKey.public }`,
                root_owner_address: '0:0000000000000000000000000000000000000000000000000000000000000000',
                wallet_code: walletCode.toString(),
            },
        });

        if (result.transaction.status !== 3) {
            console.error('Could not deploy contract.', result);
            throw new ServerErrorError();
        }
    }

    private async getTotalSupply(rootAccount: Account): Promise<number> {
        const result = await rootAccount.runLocal('getTotalSupply', {});
        return result.decoded?.output.totalSupply;
    }

    private async getWalletAddress(rootAccount: Account, totalSupply: number): Promise<string> {
        const result = await rootAccount.runLocal('getWalletAddress', {
            number: totalSupply,
        });

        return result.decoded?.output.addr;
    }

    private async deployWallet(rootNftContract: ContractModel, address: string, signKey: SignKey, params: ParamsDto): Promise<void> {
        const account = new Account({
            abi: rootNftContract.abi,
            tvc: rootNftContract.tvc_base64
        }, {
            signer: signerKeys(signKey),
            address: address,
            client: this.client,
        });

        const result = await account.run('deployWallet', {
            nft_item_name: CreateTokenService.toAscii(params.name),
            nft_item_author: CreateTokenService.toAscii(params.author),
            nft_item_link: CreateTokenService.toAscii(params.link),
            wallet_gallery: params.galleryWalletAddress,
            wallet_author: params.authorWalletAddress,
            wallet_owner: params.ownerWalletAddress,
            gallery_perc: params.galleryPercent ? (params.galleryPercent * 100) : 0,
            author_perc: params.authorPercent ? (params.authorPercent * 100) : 0,
        });

        if (result.transaction.status !== 3) {
            console.error('Could not deploy the wallet.', result);
            throw new ServerErrorError();
        }
    }

    private async getContractId(walletAddress: string): Promise<number> {
        const walletNftContract = await this.contractRepository.getOneByType(<ContractType>contractType.WalletNFT);
        const walletNftAccount = new Account({
            abi: walletNftContract.abi,
        }, {
            client: this.client,
            address: walletAddress,
        });

        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const result = await walletNftAccount.runLocal('getDetails', {});
                    resolve(result.decoded?.output.nft_item_id);
                } catch (e) {
                    reject(e);
                }
            }, 30 * 1000);
        });
    }

    private static toAscii(str: string): string {
        return Buffer.from(str, 'ascii').toString('hex');
    }
}

