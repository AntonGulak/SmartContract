import { Connection, connection } from '../../../db/connection';
import { NotFoundError } from '../../../error/not-found.error';
import { DebotLinkModel } from '../model/debot-link.model';
import { DebotLinkType } from '../type/debot-link.type';
import {envType} from '../../../config/env_type';
export class DebotLinkRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async findAll(): Promise<Array<DebotLinkModel>> {
        const sql = `SELECT * FROM debot_link WHERE env_type = $1`;
        const sources = await this.connection.fetchRows(sql, [envType]);
        return sources.map(source => {
            return <DebotLinkModel>source
        });
    }

    async getOneByType(type: DebotLinkType): Promise<DebotLinkModel> {
        
        const sql = `SELECT * FROM debot_link WHERE type = $1 AND env_type = $2 ORDER BY created_at DESC LIMIT 1`;
        const source = await this.connection.fetchRow(sql, [type, envType]);
        if (!source) {
            throw new NotFoundError(`Debot "${ type }" not found.`);
        }
        
        return <DebotLinkModel>source;
    }

}

export const debotLinkRepository = new DebotLinkRepository();
