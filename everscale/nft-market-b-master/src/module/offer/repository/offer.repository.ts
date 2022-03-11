import { Connection, connection } from '../../../db/connection';
import { ServerErrorError } from '../../../error/server-error.error';
import { OfferModel } from '../model/offer.model';
import { OfferState } from '../vo/offer-state.vo';

export class OfferRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async findOneById(id: number): Promise<OfferModel|null> {
        const sql = `SELECT * FROM offer WHERE id = $1`;
        const source = await this.connection.fetchRow(sql, [id]);
        if (!source) {
            return null;
        }

        return <OfferModel>source;
    }

    async findOneActualByProductId(productId: number): Promise<OfferModel|null> {
        const sql = `SELECT * FROM offer WHERE product_id = $1 AND state = '${OfferState.ACTUAL}' ORDER BY created_at DESC`;
        const source = await this.connection.fetchRow(sql, [productId]);
        if (!source) {
            return null;
        }

        return <OfferModel>source;
    }

    async findAllByParams(): Promise<Array<OfferModel>> {
        const sql = `SELECT * FROM offer`;
        return await this.connection.fetchRows(sql) as OfferModel[];
    }

    async findAllByProductId(productId: number): Promise<Array<OfferModel>> {
        const sql = `SELECT * FROM offer WHERE product_id = $1`;
        return await this.connection.fetchRows(sql, [productId]) as OfferModel[];
    }

    async insert(offerModel: OfferModel): Promise<OfferModel> {
        try {
            return <OfferModel>await this.connection.insert('offer', offerModel);
            
        } catch {
            throw new ServerErrorError('Could not create offer.'); 
        }
    }

    async updateStateByOfferId(offerId: number, state: string): Promise<void> {
        try {
            const sql =  `UPDATE "offer" SET state = $1 WHERE id = $2`;
            await this.connection.fetchRow(sql, [state, offerId]);
        } catch (e) {
            throw new ServerErrorError('Could not update offer.');
        }
    }

    async updateStateByProductId(productId: number, state: string): Promise<void> {
        try {
            const sql =  `UPDATE "offer" SET state = $1 WHERE product_id = $2 AND state = '${OfferState.ACTUAL}'`;
            await this.connection.fetchRow(sql, [state, productId]);
        } catch (e) {
            throw new ServerErrorError('Could not update offers.');
        }
    }

    async updateStateByProductIdAndExludingOfferId(productId: number, offerId: number, state: string): Promise<void> {
        try {
            const sql =  `UPDATE "offer" SET state = $1 WHERE product_id = $2 AND id != $3 AND state = '${OfferState.ACTUAL}'`;
            await this.connection.fetchRow(sql, [state, productId, offerId]);
        } catch (e) {
            throw new ServerErrorError('Could not update offers.');
        }
    }

}

export const offerRepository = new OfferRepository();