import { AuthorRepository, authorRepository } from '../../author/repository/author.repository';
import { UserRepository, userRepository } from '../repository/user.repository';
import { AuthorDto } from './dto/author.dto';
import { ImageHelper } from "../../../helper/image.helper";
import { ImageType } from "../../author/vo/image-type.vo";

export class AuthorAssembler {
    private readonly userRepository: UserRepository;
    private readonly authorRepository: AuthorRepository;
    private readonly imageHelper: ImageHelper;

    constructor() {
        this.userRepository = userRepository;
        this.authorRepository = authorRepository;
        this.imageHelper = new ImageHelper();
    }

    async assemble(authorId: number, imageSize: number = ImageType.DEFAULT_SIZE): Promise<AuthorDto> {
        const authorDto: AuthorDto = {
            id: 0,
            username: '',
            first_name: '',
            last_name: '',
            avatar: '',
        };

        if (authorId) {
            // todo здесь временный костыль для обратной совместимости
            // далее у продукта при добавлении будем сохранять author_id на таблицу авторов, а не пользователей
            // Пока будет работать старый формат. Но если прикрепили к пользователю автора, то будет автор из новой таблицы

            const authorModel = await this.authorRepository.findOneByUserId(authorId);
            if (authorModel) {
                authorDto.id = authorModel.id;
                authorDto.first_name = authorModel.first_name;
                authorDto.last_name = authorModel.last_name;
                authorDto.avatar = this.imageHelper.getResizedWebPath(authorModel.image, imageSize);
                authorDto.author_id = authorModel.id;
            }
            else {
                const userModel = await this.userRepository.findOneById(authorId);
                if (userModel) {
                    authorDto.id = userModel.id;
                    authorDto.username = userModel.username;
                    authorDto.first_name = userModel.first_name;
                    authorDto.last_name = userModel.last_name;
                    authorDto.avatar = userModel.avatar;
                }
            }
        }

        return authorDto;
    }
}
