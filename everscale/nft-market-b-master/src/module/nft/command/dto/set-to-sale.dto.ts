export interface SetToSaleDto {
    product_id: number;
    price: number;
    sale_type: string;
    expire_at?: string;
}
