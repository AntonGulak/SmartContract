import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { GalleryAssembler } from '../assembler/gallery.assembler';
import { GalleryModel } from '../model/gallery.model';
import { GalleryRepository, galleryRepository } from '../repository/gallery.repository';
import { GetGalleryDto } from './dto/get-gallery.dto';
import { FileHelper, UploadResult } from "../../../helper/file.helper";
import { UploadedFile } from "express-fileupload";
import { UnprocessableEntityError } from "../../../error/unprocessable-entity.error";
import { ResizeGalleryImageService } from "../service/resize-gallery-image.service";
import { ForbiddenError } from "../../../error/forbidden.error";
import { EditGalleryDto } from './dto/edit-gallery.dto';
import { NotFoundError } from '../../../error/not-found.error';
import { GalleryRightsService } from '../service/gallery-rights.service';


export class EditGalleryCommand extends CommandContract {

    private readonly galleryRepository: GalleryRepository;
    private readonly galleryAssembler: GalleryAssembler;
    private readonly fileHelper: FileHelper;
    private readonly resizeGalleryImageService: ResizeGalleryImageService;

    constructor() {
        super();
        this.onlyAuthorized = true;
        this.galleryRepository = galleryRepository;
        this.galleryAssembler = new GalleryAssembler();
        this.resizeGalleryImageService = new ResizeGalleryImageService();
        this.fileHelper = new FileHelper();
    }

    async run(req: Request): Promise<any> {
        const editGalleryDto =  <EditGalleryDto>{...req.body, id: req.params.id};
        const gallery = await this.galleryRepository.findOneById(editGalleryDto.id);
        if (!gallery) {
            throw new NotFoundError('Gallery not found.');
        }

        if (! await (new GalleryRightsService()).hasRights(gallery)) {
            throw new ForbiddenError('Not enough rights.');
        }
        // todo пока без валидации

        const galleryModel = <GalleryModel>{
            id: editGalleryDto.id,
            name: editGalleryDto.name,
            owner_id: editGalleryDto.owner_id,
            nft_address: editGalleryDto.nft_address,
            nft_public_key: editGalleryDto.nft_public_key,
            email: editGalleryDto.email,
            description_full: editGalleryDto.description_full,
            description_short: editGalleryDto.description_short,
            country: editGalleryDto.country,
            city: editGalleryDto.city,
            insta: editGalleryDto.insta,
            fb: editGalleryDto.fb
        };

        if (req.files) {
            const uploadResult = new UploadResult('gallery');
            if (await this.fileHelper.upload(req.files?.image as UploadedFile, uploadResult)) {
                galleryModel.image = uploadResult.webPath;
                this.resizeGalleryImageService.resize(uploadResult.webPath);
            } else {
                throw new UnprocessableEntityError(uploadResult.errors.join('; '));
            }
        }
        const updatedGallery = await this.galleryRepository.update(galleryModel);

        const galleryDto = await this.galleryAssembler.assemble(Number(updatedGallery.id));
        return <GetGalleryDto>{ item: galleryDto };
    }
}
