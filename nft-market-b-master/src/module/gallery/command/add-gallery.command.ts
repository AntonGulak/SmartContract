import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { GalleryAssembler } from '../assembler/gallery.assembler';
import { GalleryModel } from '../model/gallery.model';
import { GalleryRepository, galleryRepository } from '../repository/gallery.repository';
import { AddGalleryDto } from './dto/add-gallery.dto';
import { GetGalleryDto } from './dto/get-gallery.dto';
import { FileHelper, UploadResult } from "../../../helper/file.helper";
import { UploadedFile } from "express-fileupload";
import { UnprocessableEntityError } from "../../../error/unprocessable-entity.error";
import { ResizeGalleryImageService } from "../service/resize-gallery-image.service";
import { UserStorage, userStorage } from "../../user/storage/user.storage";
import { UserRole } from "../../user/vo/user-role.vo";
import { ForbiddenError } from "../../../error/forbidden.error";
import { UserModel } from "../../user/model/user.model";


export class AddGalleryCommand extends CommandContract {

    private readonly galleryRepository: GalleryRepository;
    private readonly galleryAssembler: GalleryAssembler;
    private readonly fileHelper: FileHelper;
    private readonly resizeGalleryImageService: ResizeGalleryImageService;
    private readonly userStorage: UserStorage;

    constructor() {
        super();
        this.onlyAuthorized = true;
        this.galleryRepository = galleryRepository;
        this.galleryAssembler = new GalleryAssembler();
        this.resizeGalleryImageService = new ResizeGalleryImageService();
        this.fileHelper = new FileHelper();
        this.userStorage = userStorage;
    }

    async run(req: Request): Promise<any> {
        const user = this.userStorage.get() as UserModel;
        if (!(new UserRole(user.role)).isAdmin()) {
            throw new ForbiddenError('Only admin can create gallery');
        }
        const addGalleryDto = <AddGalleryDto>{...req.body};

        // todo пока без валидации

        const galleryModel = <GalleryModel>{
            name: addGalleryDto.name,
            owner_id: addGalleryDto.owner_id,
            nft_address: addGalleryDto.nft_address,
            nft_public_key: addGalleryDto.nft_public_key,
            email: addGalleryDto.email,
            description_full: addGalleryDto.description_full,
            description_short: addGalleryDto.description_short,
            country: addGalleryDto.country,
            city: addGalleryDto.city,
            insta: addGalleryDto.insta,
            fb: addGalleryDto.fb
        };

        const uploadResult = new UploadResult('gallery');
        if (await this.fileHelper.upload(req.files?.image as UploadedFile, uploadResult)) {
            galleryModel.image = uploadResult.webPath;
            this.resizeGalleryImageService.resize(uploadResult.webPath);
        } else {
            throw new UnprocessableEntityError(uploadResult.errors.join('; '));
        }
        const createdGallery = await this.galleryRepository.insert(galleryModel);

        const galleryDto = await this.galleryAssembler.assemble(Number(createdGallery.id));
        return <GetGalleryDto>{ item: galleryDto };
    }
}
