import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { GalleryRepository, galleryRepository } from '../repository/gallery.repository';
import { GetGalleriesDto } from './dto/get-galleries.dto';
import { GalleryOnListMapper } from '../mapper/gallery-on-list.mapper';


export class GetGalleriesListCommand extends CommandContract {

    private readonly galleryRepository : GalleryRepository;
    private readonly galleryOnListMapper : GalleryOnListMapper;

    constructor() {
        super();
        this.galleryRepository = galleryRepository;
        this.galleryOnListMapper = new GalleryOnListMapper();
    }

    async run(req: Request): Promise<any> {
        const galleries = await this.galleryRepository.findAll();
        
        return <GetGalleriesDto>{
            items: await Promise.all(galleries.map(this.galleryOnListMapper.map.bind(this.galleryOnListMapper))),
        };
    }
}
