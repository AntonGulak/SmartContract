import { ModuleContract } from '../../contract/module.contract';
import { method, Route } from '../../contract/route.contract';
import { DbTableListCommand } from './command/db-table-list.command';
import { DbTablesListCommand } from './command/db-tables-list.command';

export class DbModule implements ModuleContract {
    basePath = '/db';
    routes: Route[] = [
        {
            method: method.GET,
            path: '/tables',
            command: DbTablesListCommand,
        },
        {
            method: method.GET,
            path: '/table/:tableName',
            command: DbTableListCommand,
        },
    ];
}
