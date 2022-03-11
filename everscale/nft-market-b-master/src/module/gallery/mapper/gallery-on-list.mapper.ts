import { GalleryModel } from "../model/gallery.model";
import { GalleryOnListDto } from "./dto/gallery-on-list.dto";
import {ImageHelper} from "../../../helper/image.helper";
import {ImageType} from "../vo/image-type.vo";
import { ProductRepository, productRepository } from "../../product/repository/product.repository";

export class GalleryOnListMapper {

    private readonly imageHelper: ImageHelper;
    private readonly productRepository: ProductRepository;
    constructor() {
        this.imageHelper = new ImageHelper();
        this.productRepository = productRepository;
    }

    async map(galleryModel: GalleryModel): Promise<GalleryOnListDto> {
        return {
            id: galleryModel.id,
            name: galleryModel.name,
            image: this.imageHelper.getResizedWebPath(galleryModel.image, ImageType.DEFAULT_SIZE),
            nft_address: galleryModel.nft_address,
            nft_public_key: galleryModel.nft_public_key,
            email: galleryModel.email,
            description_full: galleryModel.description_full,
            description_short: galleryModel.description_short,
            country: galleryModel.country,
            city: galleryModel.city,
            insta: galleryModel.insta,
            fb: galleryModel.fb,
            products_amount: await this.productRepository.getCountByGalleryId(galleryModel.id)
        }
    }
}
