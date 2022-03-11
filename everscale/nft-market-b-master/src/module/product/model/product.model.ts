export interface ProductModel {
    id: number;
    name: string;
    description: string;
    image: string;
    video: string;
    price: number;
    expire_at: string;
    author_id: number;
    owner_id: number;
    created_at: string;
    updated_at: string;
    nft_token_id: number|null;
    year: number;
    license: number;
    comission_gallery: number;
    comission_author: number;
    comission_author_2: number;
    type: string;
    sub_type_info: string;
    gallery_id: number;
    author_table_id: number;
    sale_state: string;
    last_offer_price?: number;
}
