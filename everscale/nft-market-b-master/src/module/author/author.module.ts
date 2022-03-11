import { ModuleContract } from '../../contract/module.contract';
import { method, Route } from '../../contract/route.contract';
import { AddAuthorCommand } from './command/add-author.command';
import { GetAuthorCommand } from './command/get-author.command';
import { AuthorDictionaryListCommand } from "./command/author-dictionary-list.command";
import { EditAuthorCommand } from './command/edit-author.command';

export class AuthorModule implements ModuleContract {
    basePath = '/author';
    routes: Route[] = [
        {
            method: method.GET,
            path: '/dictionary',
            command: AuthorDictionaryListCommand,
        },
        {
            method: method.GET,
            path: '/:id',
            command: GetAuthorCommand,
        },
        {
            method: method.POST,
            path: '',
            command: AddAuthorCommand,
        },
        {
            method: method.POST,
            path: '/:id',
            command: EditAuthorCommand,
        },
    ];
}
