import { NotFoundError } from "../../../error/not-found.error";
import { GalleryRepository, galleryRepository } from "../repository/gallery.repository";
import { GalleryDto } from "./dto/gallery.dto";
import {ImageHelper} from "../../../helper/image.helper";
import {ImageType} from "../vo/image-type.vo";

export class GalleryAssembler {

    private readonly galleryRepository: GalleryRepository;
    private readonly imageHelper: ImageHelper;

    constructor() {
        this.galleryRepository = galleryRepository;
        this.imageHelper = new ImageHelper();
    }

    async assemble(galleryId: number): Promise<GalleryDto> {
        const gallery = await this.galleryRepository.findOneById(galleryId);
        if (!gallery) {
            throw new NotFoundError('Gallery not found.');
        }

        return <GalleryDto>{
            id: gallery.id,
            owner_id: gallery.owner_id,
            name: gallery.name,
            image: this.imageHelper.getResizedWebPath(gallery.image, ImageType.DEFAULT_SIZE),
            nft_address: gallery.nft_address,
            nft_public_key: gallery.nft_public_key,
            email: gallery.email,
            description_full: gallery.description_full,
            description_short: gallery.description_short,
            country: gallery.country,
            city: gallery.city,
            insta: gallery.insta,
            fb: gallery.fb
        };
    }
}
