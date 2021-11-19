import { NotFoundError } from "../../../error/not-found.error";
import { AuthorRepository, authorRepository } from "../repository/author.repository";
import { AuthorDto } from "./dto/author.dto";
import { ImageHelper } from "../../../helper/image.helper";
import { ImageType } from "../vo/image-type.vo";


export class AuthorAssembler {

    private readonly authorRepository: AuthorRepository;
    private readonly imageHelper: ImageHelper;

    constructor() {
        this.authorRepository = authorRepository;
        this.imageHelper = new ImageHelper();
    }

    async assemble(authorId: number): Promise<AuthorDto> {
        const author = await this.authorRepository.findOneById(authorId);
        if (!author) {
            throw new NotFoundError('Author not found.');
        }

        return <AuthorDto>{
            id: author.id,
            user_id: author.user_id,
            // todo пока без подключения названий галерей
            gallery_id: author.gallery_id,
            first_name: author.first_name,
            last_name: author.last_name,
            image: this.imageHelper.getResizedWebPath(author.image, ImageType.DEFAULT_SIZE),
            nft_address: author.nft_address,
            nft_public_key: author.nft_public_key,
            email: author.email,
            description: author.description,
            country: author.country,
            city: author.city,
            insta: author.insta,
            fb: author.fb
        };
    }
}
