import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { DbRepository, dbRepository } from '../repository/db.repository';


export class DbTablesListCommand extends CommandContract {

    private readonly dbRepository : DbRepository;

    constructor() {
        super();
        this.dbRepository = dbRepository;
    }

    async run(req: Request): Promise<any> {
        const tables = await this.dbRepository.findTablesList();

        return tables;
    }
}
