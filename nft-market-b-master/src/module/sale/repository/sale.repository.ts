import { SaleModel } from '../model/sale.model';
import { Connection, connection } from '../../../db/connection';
import { ServerErrorError } from '../../../error/server-error.error';

export class SaleRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async insert(saleModel: SaleModel): Promise<SaleModel> {
        try {
            return <SaleModel>await this.connection.insert('sale', saleModel);
        } catch (e) {
            throw new ServerErrorError('Could not create sale.');
        }
    }

    async findAllByProductId(productId: number): Promise<Array<SaleModel>> {
        const sql = `SELECT * FROM sale WHERE item_id = $1`;
        return await this.connection.fetchRows(sql, [productId]) as SaleModel[];
    }
}

export const saleRepository = new SaleRepository();
