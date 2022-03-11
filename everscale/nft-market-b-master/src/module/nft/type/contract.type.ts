export const contractType = {
    RootNFT: 'RootNFT',
    WalletNFT: 'WalletNFT',
    DirectSell: 'DirectSell',
    Auction: 'SimpleAuction',
    SafeMultisigWallet: 'SafeMultisigWallet',
    DebotDirectBuy: 'DebotDirectBuy',
    DebotCreateDirectSell: 'DebotCreateDirectSell',
    DebotStopDirectSell: 'DebotStopDirectSell',
    DebotCreateAuction: 'DebotCreateAuction',
    DebotStopAuction: 'DebotStopAuction',
    DebotCreateOffer: 'DebotCreateOffer',
}

export type ContractType = 'RootNFT' | 'WalletNFT' | 'DirectSell' | 'SimpleAuction' | 'SafeMultisigWallet' | 'DebotDirectBuy' | 'DebotCreateDirectSell' | 'DebotStopDirectSell' | 'DebotCreateAuction' | 'DebotStopAuction' | 'DebotCreateOffer' | null;
