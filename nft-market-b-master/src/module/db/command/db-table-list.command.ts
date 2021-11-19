import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { DbRepository, dbRepository } from '../repository/db.repository';


export class DbTableListCommand extends CommandContract {

    private readonly dbRepository : DbRepository;

    constructor() {
        super();
        this.dbRepository = dbRepository;
    }

    async run(req: Request): Promise<any> {
        const tableName = req.params.tableName;
        const tables = await this.dbRepository.findAllByTable(tableName);

        return tables;
    }
}
