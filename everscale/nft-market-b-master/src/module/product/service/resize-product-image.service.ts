import { ImageHelper } from "../../../helper/image.helper";
import { ImageType } from "../vo/image-type.vo";

export class ResizeProductImageService {
    
    private readonly imageHelper: ImageHelper;
    
    constructor() {
        this.imageHelper = new ImageHelper();
    }
    
    resize(image: string): void {
       this.imageHelper.resizeWidthOrHeight(image, ImageType.PRODUCT_SIZE);
       this.imageHelper.resizeWidth(image, ImageType.LIST_SIZE);
    }
}