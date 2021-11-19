import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { ProductAssembler } from '../assembler/product.assembler';
import { ProductModel } from '../model/product.model';
import { ProductRepository, productRepository } from '../repository/product.repository';
import { AddProductDto } from './dto/add-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { FileHelper, UploadResult } from '../../../helper/file.helper';
import { UnprocessableEntityError } from '../../../error/unprocessable-entity.error';
import { AddProductValidator } from '../validator/add-product.validator';
import { ValidationError } from '../../../error/validation.error';
import { UploadedFile } from 'express-fileupload';
import { userStorage, UserStorage } from '../../user/storage/user.storage';
import { UserModel } from '../../user/model/user.model';
import { ResizeProductImageService } from "../service/resize-product-image.service";
import { CreateTokenService } from '../../nft/service/create-token.service';
import { ParamsDto } from '../../nft/service/dto/params.dto';
import { globals } from '../../../config/globals';
import { galleryRepository, GalleryRepository } from '../../gallery/repository/gallery.repository';
import { AccountType } from '../../user/vo/account-type.vo';
import { AuthorRepository, authorRepository } from '../../author/repository/author.repository';
import { UserRepository, userRepository } from '../../user/repository/user.repository';
import { WalletService } from '../../user/service/wallet.service';
import { UnauthorizedError } from '../../../error/unauthorized.error';

export class AddProductCommand extends CommandContract {
    private readonly productRepository: ProductRepository;
    private readonly productAssembler: ProductAssembler;
    private readonly authorRepository: AuthorRepository;
    private readonly fileHelper: FileHelper;
    private readonly userStorage: UserStorage;
    private readonly resizeProductImageService: ResizeProductImageService;
    private readonly createTokenService: CreateTokenService;
    private readonly galleryRepository: GalleryRepository;
    private readonly userRepository: UserRepository;
    private readonly walletService: WalletService;

    constructor() {
        super();
        //this.onlyAuthorized = true;
        this.productRepository = productRepository;
        this.productAssembler = new ProductAssembler();
        this.fileHelper = new FileHelper();
        this.userStorage = userStorage;
        this.resizeProductImageService = new ResizeProductImageService();
        this.createTokenService = new CreateTokenService();
        this.authorRepository = authorRepository;
        this.galleryRepository = galleryRepository;
        this.userRepository = userRepository;
        this.walletService = new WalletService();
    }

    async run(req: Request): Promise<any> {
        const addProductDto = <AddProductDto>{...req.body};
        const validator : AddProductValidator = new AddProductValidator();
        if (!validator.validate(addProductDto)) {
            throw new ValidationError(validator.getValidationResult());
        }
        let user = this.userStorage.get() as UserModel;
        if(!user) {
            if (addProductDto.owner_wallet) {
                user = await this.walletService.getOrCreateUser(addProductDto.owner_wallet);
            }
            else {
                throw new UnauthorizedError('User is unauthorized.');
            }
        }

        const productModel = <ProductModel>{
            name: addProductDto.name,
            description: addProductDto.description,
            price: 0, // При создании цены нет, она появляется при выставлении на продажу
            author_id: addProductDto.author_id,
            owner_id: user.id,
            year: addProductDto.year,
            license: addProductDto.license,
            comission_gallery: addProductDto.comission_gallery,
            comission_author: addProductDto.comission_author,
            comission_author_2: addProductDto.comission_author_2,
            sub_type_info: addProductDto.sub_type_info,
            gallery_id: addProductDto.gallery_id,
            author_table_id: addProductDto.author_id
        };

        if (addProductDto.product_type) {
            productModel.type = addProductDto.product_type;
        }

        if (user.account_type == AccountType.GALLERY && user.owner_for_id) {
            productModel.gallery_id = user.owner_for_id;
        }
        else if (user.account_type == AccountType.AUTHOR && user.owner_for_id) {
            productModel.author_id = user.owner_for_id;
            const authorModel = await this.authorRepository.findOneById(user.owner_for_id);
            if (authorModel && authorModel.gallery_id) {
                productModel.gallery_id = authorModel.gallery_id;
            }
        }

        const galleryOwner = await this.userRepository.findGalleryOwner(productModel.gallery_id);
        if (galleryOwner) {
            // productModel.owner_id = galleryOwner.id;
        }

        await this.loadFiles(productModel, req);
        const createdProduct = await this.productRepository.insert(productModel);

        const author = await this.authorRepository.findOneById(createdProduct.author_id);
        const gallery = await this.galleryRepository.findOneById(createdProduct.gallery_id);
        
        this.createTokenService.create(<ParamsDto>{
            name: `blue_bumblebee_product_${ createdProduct.id }_${ createdProduct.name }`,
            symbol: `blue_bumblebee_product_${ createdProduct.id }`,
            author: `blue_bumblebee_author_${ createdProduct.author_id }`,
            link: `${ globals.DOMAIN }/product/${ createdProduct.id }`,
            galleryPercent: createdProduct.comission_gallery,
            authorPercent: createdProduct.comission_author,
            authorWalletAddress: author?.nft_address,
            galleryWalletAddress: gallery?.nft_address,
            ownerWalletAddress: user.wallet
        }).then(async (res: number|null) => {
            createdProduct.nft_token_id = res;
            await this.productRepository.update(createdProduct);
        });

        const productDto = await this.productAssembler.assemble(Number(createdProduct.id));
        return <GetProductDto>{ item: productDto };
    }

    private async loadFiles(product: ProductModel, req: Request): Promise<void> {
        const uploadImageResult = new UploadResult('product');
        if (await this.fileHelper.upload(req.files?.image as UploadedFile, uploadImageResult)) {
            product.image = uploadImageResult.webPath;
            this.resizeProductImageService.resize(uploadImageResult.webPath);
        } else {
            throw new UnprocessableEntityError(uploadImageResult.errors.join('; '));
        }

        const uploadVideoResult = new UploadResult('product');
        if (req.files && req.files.video) {
            if (await this.fileHelper.upload(req.files?.video as UploadedFile, uploadVideoResult)) {
                product.video = uploadVideoResult.webPath;
            } else {
                throw new UnprocessableEntityError(uploadVideoResult.errors.join('; '));
            }
        }
    }
}
