import { ModuleContract } from '../../contract/module.contract';
import { method, Route } from '../../contract/route.contract';
import { GetProductCommand } from './command/get-product.command';
import { AddProductCommand } from './command/add-product.command';
import { EditProductCommand } from './command/edit-product.command';

export class ProductModule implements ModuleContract {
    basePath = '/product';
    routes: Route[] = [
        {
            method: method.GET,
            path: '/:id',
            command: GetProductCommand,
        },
        {
            method: method.POST,
            path: '',
            command: AddProductCommand,
        },
        {
            method: method.PUT,
            path: '/:id',
            command: EditProductCommand,
        },
    ];
}
