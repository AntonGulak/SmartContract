import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { AuthorAssembler } from '../assembler/author.assembler';
import { AuthorModel } from '../model/author.model';
import { AuthorRepository, authorRepository } from '../repository/author.repository';
import { AddAuthorDto } from './dto/add-author.dto';
import { GetAuthorDto } from './dto/get-author.dto';
import { UploadResult, FileHelper } from "../../../helper/file.helper";
import { UploadedFile } from "express-fileupload";
import { UnprocessableEntityError } from "../../../error/unprocessable-entity.error";
import { ResizeAuthorImageService } from "../service/resize-author-image.service";
import { ForbiddenError } from "../../../error/forbidden.error";
import { AuthorRightsService } from '../service/author-rights.service';


export class AddAuthorCommand extends CommandContract {

    private readonly authorRepository: AuthorRepository;
    private readonly authorAssembler: AuthorAssembler;
    private readonly fileHelper: FileHelper;
    private readonly resizeAuthorImageService: ResizeAuthorImageService;
    private readonly authorRightsService: AuthorRightsService;

    constructor() {
        super();
        this.onlyAuthorized = true;
        this.authorRepository = authorRepository;
        this.authorAssembler = new AuthorAssembler();
        this.fileHelper = new FileHelper();
        this.resizeAuthorImageService = new ResizeAuthorImageService();
        this.authorRightsService = new AuthorRightsService();
    }

    async run(req: Request): Promise<any> {
        if (! await this.authorRightsService.hasRightsToAdd()) {
            throw new ForbiddenError('Not enough rights to add Author.');
        }
        const addAuthorDto = <AddAuthorDto>{...req.body};

        // todo пока без валидации

        const authorModel = <AuthorModel>{
            user_id: addAuthorDto.user_id,
            gallery_id: await this.authorRightsService.getGalleryId(addAuthorDto.gallery_id),
            first_name: addAuthorDto.first_name,
            last_name: addAuthorDto.last_name,
            nft_address: addAuthorDto.nft_address,
            nft_public_key: addAuthorDto.nft_public_key,
            email: addAuthorDto.email,
            description: addAuthorDto.description,
            country: addAuthorDto.country,
            city: addAuthorDto.city,
            insta: addAuthorDto.insta,
            fb: addAuthorDto.fb
        };

        const uploadResult = new UploadResult('author');
        if (await this.fileHelper.upload(req.files?.image as UploadedFile, uploadResult)) {
            authorModel.image = uploadResult.webPath;
            this.resizeAuthorImageService.resize(uploadResult.webPath);
        } else {
            throw new UnprocessableEntityError(uploadResult.errors.join('; '));
        }

        const createdAuthor = await this.authorRepository.insert(authorModel);

        const authorDto = await this.authorAssembler.assemble(Number(createdAuthor.id));
        return <GetAuthorDto>{ item: authorDto };
    }
}
