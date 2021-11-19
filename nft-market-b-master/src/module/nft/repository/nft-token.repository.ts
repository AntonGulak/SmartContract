import { ServerErrorError } from '../../../error/server-error.error';
import { Connection, connection } from '../../../db/connection';
import { NftTokenModel } from '../model/nft-token.model';
import { NotFoundError } from '../../../error/not-found.error';

export class NftTokenRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async getOneById(id: number): Promise<NftTokenModel> {
        const sql = `SELECT * FROM nft_token WHERE id = $1`;
        const source = await this.connection.fetchRow(sql, [id]);
        if (!source) {
            throw new NotFoundError(`Token with id = ${ id } not found.`);
        }

        return <NftTokenModel>source;
    }

    async insert(nftTokenModel: NftTokenModel): Promise<NftTokenModel> {
        try {
            return <NftTokenModel>await this.connection.insert('nft_token', nftTokenModel);
        } catch {
            throw new ServerErrorError('Could not create nft token.');
        }
    }
}

export const nftTokenRepository = new NftTokenRepository();
