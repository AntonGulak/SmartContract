import { GalleryModel } from "../model/gallery.model";
import { GalleryDictionaryListDto } from "./dto/gallery-dictionary-list.dto";

export class GalleryDictionaryListMapper {
    async map(galleryModel: GalleryModel): Promise<GalleryDictionaryListDto> {
        return {
            id: galleryModel.id,
            name: galleryModel.name
        }
    }
}
