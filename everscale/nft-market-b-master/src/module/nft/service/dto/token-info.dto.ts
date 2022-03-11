export interface TokenInfoDto {
    saleState: string;
    price: number;
    lastOfferPrice?: number;
    /** @property { string } date in format Y-m-d H:i:s */
    expiredAt: string;
    walletOwner: string;
}
