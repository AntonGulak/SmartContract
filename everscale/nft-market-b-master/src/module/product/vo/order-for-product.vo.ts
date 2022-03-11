export class OrderForProductVo {

    static NEWEST = `created_at DESC`;
    static LOWEST_PRICE = `price ASC`;
    static HIGHEST_PRICE = `price DESC`;


    private readonly order :string | null;
    constructor (orderFromApi: string | undefined | null) {
        switch(orderFromApi) {
            case 'newest':
                this.order = OrderForProductVo.NEWEST;
                break;
            case 'lowest-price':
                this.order =  OrderForProductVo.LOWEST_PRICE;
                break;
            case 'highest-price':
                this.order = OrderForProductVo.HIGHEST_PRICE;
                break;
            default:
                this.order =  null;
                break;
        }
    }

    getorder() {
        return this.order;
    }
}