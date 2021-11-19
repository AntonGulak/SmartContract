import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { GalleryRepository, galleryRepository } from '../repository/gallery.repository';
import { GalleryDictionaryListMapper } from "../mapper/gallery-dictionary-list.mapper";
import { DictionaryDto } from "./dto/dictionary.dto";


export class GalleryDictionaryListCommand extends CommandContract {

    private readonly galleryRepository : GalleryRepository;
    private readonly galleryDictionaryListMapper : GalleryDictionaryListMapper;

    constructor() {
        super();
        this.galleryRepository = galleryRepository;
        this.galleryDictionaryListMapper = new GalleryDictionaryListMapper();
    }

    async run(req: Request): Promise<any> {
        const galleries = await this.galleryRepository.findAll();

        return <DictionaryDto>{
            items: await Promise.all(galleries.map(this.galleryDictionaryListMapper.map.bind(this.galleryDictionaryListMapper))),
        };
    }
}
