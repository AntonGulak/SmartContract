import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { AuthorAssembler } from '../assembler/author.assembler';
import { AuthorModel } from '../model/author.model';
import { AuthorRepository, authorRepository } from '../repository/author.repository';
import { GetAuthorDto } from './dto/get-author.dto';
import { UploadResult, FileHelper } from "../../../helper/file.helper";
import { UploadedFile } from "express-fileupload";
import { UnprocessableEntityError } from "../../../error/unprocessable-entity.error";
import { ResizeAuthorImageService } from "../service/resize-author-image.service";
import { ForbiddenError } from "../../../error/forbidden.error";
import { AuthorRightsService } from '../service/author-rights.service';
import { EditAuthorDto } from './dto/edit-author.dto';
import { NotFoundError } from '../../../error/not-found.error';


export class EditAuthorCommand extends CommandContract {

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
        const editAuthorDto =  <EditAuthorDto>{...req.body, id: req.params.id};
        const author = await this.authorRepository.findOneById(editAuthorDto.id);
        if (!author) {
            throw new NotFoundError('Author not found.');
        }

        if (! await this.authorRightsService.hasRightsToEdit(author)) {
            throw new ForbiddenError('Not enough rights to edit Author.');
        }

        // todo пока без валидации

        const authorModel = <AuthorModel>{
            id: editAuthorDto.id,
            user_id: editAuthorDto.user_id,
            gallery_id: await this.authorRightsService.getGalleryId(editAuthorDto.gallery_id),
            first_name: editAuthorDto.first_name,
            last_name: editAuthorDto.last_name,
            nft_address: editAuthorDto.nft_address,
            nft_public_key: editAuthorDto.nft_public_key,
            email: editAuthorDto.email,
            description: editAuthorDto.description,
            country: editAuthorDto.country,
            city: editAuthorDto.city,
            insta: editAuthorDto.insta,
            fb: editAuthorDto.fb
        };

        if (req.files) {
            const uploadResult = new UploadResult('author');
            if (await this.fileHelper.upload(req.files?.image as UploadedFile, uploadResult)) {
                authorModel.image = uploadResult.webPath;
                this.resizeAuthorImageService.resize(uploadResult.webPath);
            } else {
                throw new UnprocessableEntityError(uploadResult.errors.join('; '));
            }
        }

        const createdAuthor = await this.authorRepository.update(authorModel);

        const authorDto = await this.authorAssembler.assemble(Number(createdAuthor.id));
        return <GetAuthorDto>{ item: authorDto };
    }
}
