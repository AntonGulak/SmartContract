export const debotLinkType = {
    DebotDirectBuy: 'buy',
    DebotCreateDirectSell: 'set auction',
    DebotStopDirectSell: 'offer',
    DebotCreateAuction: 'stop auction',
    DebotStopAuction: 'stop direct sale',
    DebotCreateOffer: 'set direct sale',
}

export type DebotLinkType = 'buy' | 'set auction' | 'offer' | 'stop auction' | 'stop direct sale' | 'set direct sale' | null;