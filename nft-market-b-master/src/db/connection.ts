import { Pool, PoolConfig } from 'pg';
import { db } from '../config/db';
import { ServerErrorError } from '../error/server-error.error';

const pool = new Pool(<PoolConfig>db);

export class Connection {
    async fetchRows(text, params: any[] = []): Promise<Array<object>> {
        const client = await pool.connect();
        let result;
        try {
            result = await client.query(text, params);
        }
        finally {
            client.release();
        }
        return result.rows;
    }

    async fetchRow(text, params: any[] = []): Promise<object|null> {
        const result = await this.fetchRows(text, params);
        return <object>result[0] || null;
    }

    async fetchScalar(text, params: any[] = []): Promise<string|number|boolean|null> {
        const result = await this.fetchRow(text, params);
        if (null === result) {
            return null;
        }

        const keys = Object.keys(result);
        return result[keys[0]];
    }

    async insert(tableName: string, columns: object): Promise<object> {
        const columnValues = Object.values(columns);
        const columnNames = Object.keys(columns)
            .map((columnName: string) => `"${columnName}"`)
            .join(', ');
        const valuesPlaceholder = columnValues
            .map((_, i: number) => `$${ i + 1 }`)
            .join(', ');

        const sql = `INSERT INTO "${ tableName }" (${ columnNames }) VALUES (${ valuesPlaceholder }) RETURNING *`;
        const res = await this.fetchRow(sql, columnValues);
        if (!res) {
            console.error(`Insertion error. Statement: ${ sql }, params: ${ columnValues.join(', ') }.`);
            throw new ServerErrorError('Insertion error.');
        }

        return res;
    }


    async update(tableName: string, columns: object): Promise<object> {
        const columnValues = Object.values(columns);
        const sqlSets = Object.keys(columns)
        .map((columnName: string, i: number) => `"${columnName}" = $${ ++i}`)
        .join(', ');

        const sql = `UPDATE "${ tableName }" SET ${ sqlSets } WHERE id = ($${ Object.keys(columns).length + 1}) RETURNING *`;
        columnValues.push(columns['id']);
        const res = await this.fetchRow(sql, columnValues);
        if (!res) {
            console.error(`Update error. Statement: ${ sql }, params: ${ columnValues.join(', ') }.`);
            throw new ServerErrorError('Update error.');
        }

        return res;
    }
}

export const connection = new Connection();
