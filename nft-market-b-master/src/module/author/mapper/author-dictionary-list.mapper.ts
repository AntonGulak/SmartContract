import { AuthorModel } from "../model/author.model";
import { AuthorDictionaryListDto } from "./dto/author-dictionary-list.dto";

export class AuthorDictionaryListMapper {
    async map(authorModel: AuthorModel): Promise<AuthorDictionaryListDto> {
        return {
            id: authorModel.id,
            name: authorModel.first_name + ' ' + authorModel.last_name
        }
    }
}
