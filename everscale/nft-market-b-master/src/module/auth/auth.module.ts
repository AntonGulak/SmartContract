import { ModuleContract } from '../../contract/module.contract';
import { method, Route } from '../../contract/route.contract';
import { SignUpCommand } from './command/sign-up.command';
import { LoginCommand } from './command/login.command';

export class AuthModule implements ModuleContract {
    basePath = '/auth';

    routes: Route[] = [
        {
            method: method.POST,
            path: '/sign-up',
            command: SignUpCommand,
        },
        {
            method: method.POST,
            path: '/login',
            command: LoginCommand,
        },
    ];
}
