import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { GalleryAssembler } from '../assembler/gallery.assembler';
import { GetGalleryDto } from './dto/get-gallery.dto';


export class GetGalleryCommand extends CommandContract {

    private galleryAssembler: GalleryAssembler;

    constructor() {
        super();
        this.galleryAssembler = new GalleryAssembler();
    }

    async run(req: Request): Promise<any> {
        const galleryId = Number(req.params.id);
        const galleryDto = await this.galleryAssembler.assemble(galleryId);

        return <GetGalleryDto>{ 
            item: galleryDto
        };
    }
}
