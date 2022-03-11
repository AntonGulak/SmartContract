import { Route } from './route.contract';

export interface ModuleContract {
    basePath: string;
    routes: Route[];
}
