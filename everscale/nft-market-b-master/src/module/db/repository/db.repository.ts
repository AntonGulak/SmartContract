import { Connection, connection } from '../../../db/connection';

export class DbRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async findAllByTable(table: string): Promise<Array<object>> {
        const sql = `SELECT * FROM "${table}" WHERE true`;

        const sources = await this.connection.fetchRows(sql, []);
        return sources.map(source => <object>source);
    }

    async findTablesList(): Promise<Array<object>> {
        let sql = `SELECT table_name FROM information_schema.tables
        WHERE table_schema NOT IN ('information_schema','pg_catalog');`;
        const sources = await this.connection.fetchRows(sql, []);
        return sources.map(source => <object>source);
    }
}

export const dbRepository = new DbRepository();
