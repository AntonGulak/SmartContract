import { Connection, connection } from '../../../db/connection';
import { ServerErrorError } from '../../../error/server-error.error';
import { BidModel } from '../model/bid.model';
import {BidState} from "../vo/bid-state.vo";

export class BidRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async findOneById(id: number): Promise<BidModel|null> {
        const sql = `SELECT * FROM bid WHERE id = $1`;
        const source = await this.connection.fetchRow(sql, [id]);
        if (!source) {
            return null;
        }

        return <BidModel>source;
    }

    async findOneActualByProductId(productId: number): Promise<BidModel|null> {
        const sql = `SELECT * FROM bid WHERE product_id = $1 AND state = '${BidState.ACTUAL}' ORDER BY created_at DESC`;
        const source = await this.connection.fetchRow(sql, [productId]);
        if (!source) {
            return null;
        }

        return <BidModel>source;
    }


    async insert(bidModel: BidModel): Promise<BidModel> {
        try {
            return <BidModel>await this.connection.insert('bid', bidModel);
            
        } catch (e) {
            throw new ServerErrorError('Could not create bid.'); 
        }
    }

    async updateStateByProductId(productId: number, state: string): Promise<void> {
        try {
            const sql =  `UPDATE "bid" SET state = $1 WHERE product_id = $2 AND state = '${BidState.ACTUAL}'`;
            await this.connection.fetchRow(sql, [state, productId]);
        } catch (e) {
            throw new ServerErrorError('Could not update offers.');
        }
    }

}

export const bidRepository = new BidRepository();