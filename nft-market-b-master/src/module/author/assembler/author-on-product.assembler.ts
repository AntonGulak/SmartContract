import { AuthorRepository, authorRepository } from "../repository/author.repository";
import { AuthorDto as AuthorUserDto} from "../../user/assembler/dto/author.dto";
import { ImageHelper } from "../../../helper/image.helper";
import { ImageType } from "../vo/image-type.vo";


export class AuthorOnProductAssembler {

    private readonly authorRepository: AuthorRepository;
    private readonly imageHelper: ImageHelper;

    constructor() {
        this.authorRepository = authorRepository;
        this.imageHelper = new ImageHelper();
    }

    async assemble(authorId: number, imageSize: number = ImageType.DEFAULT_SIZE): Promise<AuthorUserDto> {
        const authorDto: AuthorUserDto = {
            id: 0,
            username: '',
            first_name: '',
            last_name: '',
            avatar: '',
        };

        if (authorId) {
            const authorModel = await this.authorRepository.findOneById(authorId);
            if (authorModel) {
                authorDto.id = authorModel.id;
                authorDto.first_name = authorModel.first_name;
                authorDto.last_name = authorModel.last_name;
                authorDto.avatar = this.imageHelper.getResizedWebPath(authorModel.image, imageSize);
                authorDto.author_id = authorModel.id;
            }
        }

        return authorDto;
    }
}
