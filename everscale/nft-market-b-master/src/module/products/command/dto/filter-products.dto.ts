export interface FilterProductsDto {
    owner_id?: number;
    author_id?: number;
    gallery_id?: number;
    wallet?: string;
    types?: string[] | string;
    order?: string;
    sale_states?: [] | string;
}
