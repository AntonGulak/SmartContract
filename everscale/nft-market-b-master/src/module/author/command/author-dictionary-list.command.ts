import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { authorRepository, AuthorRepository } from "../repository/author.repository";
import { AuthorDictionaryListMapper } from "../mapper/author-dictionary-list.mapper";
import { DictionaryDto } from "./dto/dictionary.dto";
import { UserStorage, userStorage } from '../../user/storage/user.storage';
import { UserModel } from '../../user/model/user.model';
import { AccountType } from '../../user/vo/account-type.vo';
import { AuthorModel } from '../model/author.model';


export class AuthorDictionaryListCommand extends CommandContract {

    private readonly authorRepository : AuthorRepository;
    private readonly authorDictionaryListMapper: AuthorDictionaryListMapper;
    private readonly userStorage: UserStorage;

    constructor() {
        super();
        this.authorRepository = authorRepository;
        this.authorDictionaryListMapper = new AuthorDictionaryListMapper();
        this.userStorage = userStorage;
    }

    async run(req: Request): Promise<any> {
        const user = this.userStorage.get() as UserModel;
        let authors: AuthorModel[];
        if(user && user.account_type == AccountType.GALLERY) {
            authors = await this.authorRepository.findAllByGalleryId(user.owner_for_id as number);
        }
        else if (user) {
            authors = await this.authorRepository.findAll();
        }
        else {
            authors = await this.authorRepository.findAllToUnAuth();
        }

        return <DictionaryDto>{
            items: await Promise.all(authors.map(this.authorDictionaryListMapper.map.bind(this.authorDictionaryListMapper))),
        };
    }
}
