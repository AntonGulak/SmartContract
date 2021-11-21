import { ImageHelper } from "../../../helper/image.helper";
import { ImageType } from "../vo/image-type.vo";

export class ResizeGalleryImageService {
    
    private readonly imageHelper: ImageHelper;
    
    constructor() {
        this.imageHelper = new ImageHelper();
    }
    
    resize(image: string): void {
        this.imageHelper.cropToSquare(image, [ImageType.DEFAULT_SIZE]);
    }
}