import { Router } from 'express';
import { method, Route } from './contract/route.contract';
import { modules } from './config/modules';
import { ModuleContract } from './contract/module.contract';
import { globals } from './config/globals';

export const router = Router();

modules.map((module: ModuleContract) => {
    module.routes.map((route: Route) => {
        const command = new route.command();
        switch (route.method) {
            case method.GET:
                router.get(globals.BASE_PATH + module.basePath + route.path, command.runExternal.bind(command));
                break;
            case method.PUT:
                router.put(globals.BASE_PATH + module.basePath + route.path, command.runExternal.bind(command));
                break;
            case method.POST:
                router.post(globals.BASE_PATH + module.basePath + route.path, command.runExternal.bind(command));
                break;
            case method.DELETE:
                router.delete(globals.BASE_PATH + module.basePath + route.path, command.runExternal.bind(command));
                break;
        }
    });
});
