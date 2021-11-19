export interface OfferModel {
    id: number;
    user_id: number;
    product_id: number;
    state: string;
    price_crystal: number;
    expire_at: string;
}