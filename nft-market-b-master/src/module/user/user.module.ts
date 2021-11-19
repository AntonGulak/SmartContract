import { ModuleContract } from '../../contract/module.contract';
import { method, Route } from '../../contract/route.contract';
import { MeCommand } from "./command/me.command";
import { CreateUserCommand } from "./command/create-user.command";

export class UserModule implements ModuleContract {
    basePath = '/user';

    routes: Route[] = [
        {
            method: method.GET,
            path: '/me',
            command: MeCommand,
        },
        {
            method: method.POST,
            path: '/create',
            command: CreateUserCommand,
        },
    ];
}
