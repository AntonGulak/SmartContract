import { ContractModel } from '../model/contract.model';
import { Connection, connection } from '../../../db/connection';
import { ContractType } from '../type/contract.type';
import { NotFoundError } from '../../../error/not-found.error';
import {envType} from '../../../config/env_type';

export class ContractRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async getOneByType(type: ContractType): Promise<ContractModel> {
        const sql = `SELECT * FROM contract WHERE type = $1 AND env_type = $2 ORDER BY created_at DESC LIMIT 1`;
        const source = await this.connection.fetchRow(sql, [type, envType]);
        if (!source) {
            throw new NotFoundError(`Contract "${ type }" not found.`);
        }

        return <ContractModel>source;
    }

    async getOneByCodeHash(codeHash: string): Promise<ContractModel> {
        const sql = `SELECT * FROM contract WHERE code_hash = $1 AND env_type = $2 LIMIT 1`;
        const source = await this.connection.fetchRow(sql, [codeHash, envType]);
        if (!source) {
            throw new NotFoundError(`Contract with code hash "${ codeHash }" not found.`);
        }

        return <ContractModel>source;
    }
}

export const contractRepository = new ContractRepository();
