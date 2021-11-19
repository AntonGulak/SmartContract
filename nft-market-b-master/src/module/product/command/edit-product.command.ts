import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { ProductAssembler } from '../assembler/product.assembler';
import { ProductModel } from '../model/product.model';
import { ProductRepository, productRepository } from '../repository/product.repository';
import { GetProductDto } from './dto/get-product.dto';
import { FileHelper, UploadResult } from '../../../helper/file.helper';
import { UnprocessableEntityError } from '../../../error/unprocessable-entity.error';
import { EditProductValidator } from '../validator/edit-product.validator';
import { ValidationError } from '../../../error/validation.error';
import { UploadedFile } from 'express-fileupload';
import { EditProductDto } from './dto/edit-product.dto';
import { NotFoundError } from '../../../error/not-found.error';
import { ProductRightsService } from '../service/product-rights.service';
import { ForbiddenError } from '../../../error/forbidden.error';
import { ResizeProductImageService } from "../service/resize-product-image.service";

export class EditProductCommand extends CommandContract {
    private readonly productRepository: ProductRepository;
    private readonly productAssembler: ProductAssembler;
    private readonly fileHelper: FileHelper;
    private readonly resizeProductImageService: ResizeProductImageService;

    constructor() {
        super();
        this.onlyAuthorized = true;
        this.productRepository = productRepository;
        this.productAssembler = new ProductAssembler();
        this.fileHelper = new FileHelper();
        this.resizeProductImageService = new ResizeProductImageService();
    }

    async run(req: Request): Promise<any> {
        const editProductDto =  <EditProductDto>{...req.body, id: req.params.id};
        const product = await this.productRepository.findOneById(editProductDto.id);
        if (!product) {
            throw new NotFoundError('Product not found.');
        }

        if (! await (new ProductRightsService()).hasRights(product)) {
            throw new ForbiddenError('Not enough rights.');
        }

        const validator : EditProductValidator = new EditProductValidator();
        if (!validator.validate(editProductDto)) {
             throw new ValidationError(validator.getValidationResult());
        }

        const productModel = <ProductModel>{
            name: editProductDto.name,
            description: editProductDto.description,
            //price: editProductDto.price,
            id: editProductDto.id,
            year: editProductDto.year,
            license: editProductDto.license,
            comission_gallery: editProductDto.comission_gallery,
            comission_author: editProductDto.comission_author,
            comission_author_2: editProductDto.comission_author_2,
            type: editProductDto.type,
            sub_type_info: editProductDto.sub_type_info,
            gallery_id: editProductDto.gallery_id,
            author_table_id: editProductDto.author_id
        };
        await this.loadFiles(productModel, req);

        const updatedProduct = await this.productRepository.update(productModel);
        const productDto = await this.productAssembler.assemble(Number(updatedProduct.id));
        return <GetProductDto>{ item: productDto };
    }

    private async loadFiles(product: ProductModel, req: Request): Promise<void> {
        if (!req.files) {
            return;
        }
        const uploadResult = new UploadResult('product');
        if (req.files.image) {
            if (await this.fileHelper.upload(req.files.image as UploadedFile, uploadResult)) {
                product.image = uploadResult.webPath;
                this.resizeProductImageService.resize(uploadResult.webPath);
            } else {
                throw new UnprocessableEntityError(uploadResult.errors.join('; '));
            }
        }
        // todo добавить удаление старой картинки
        const uploadVideoResult = new UploadResult('product');
        if (req.files.video) {
            if (await this.fileHelper.upload(req.files.video as UploadedFile, uploadVideoResult)) {
                product.video = uploadVideoResult.webPath;
            } else {
                throw new UnprocessableEntityError(uploadVideoResult.errors.join('; '));
            }
        }
    }
}
