import { ModuleContract } from '../../contract/module.contract';
import { method, Route } from '../../contract/route.contract';
import { AddGalleryCommand } from './command/add-gallery.command';
import { GetGalleryCommand } from './command/get-gallery.command';
import { GetGalleriesListCommand } from './command/get-galleries-list.command';
import { GalleryDictionaryListCommand } from "./command/gallery-dictionary-list.command";
import { EditGalleryCommand } from './command/edit-gallery.command';

export class GalleryModule implements ModuleContract {
    basePath = '/gallery';
    routes: Route[] = [
        {
            method: method.GET,
            path: '/list',
            command: GetGalleriesListCommand,
        },
        {
            method: method.GET,
            path: '/dictionary',
            command: GalleryDictionaryListCommand,
        },
        {
            method: method.GET,
            path: '/:id',
            command: GetGalleryCommand,
        },
        {
            method: method.POST,
            path: '',
            command: AddGalleryCommand,
        },
        {
            method: method.POST,
            path: '/:id',
            command: EditGalleryCommand,
        },
    ];
}
