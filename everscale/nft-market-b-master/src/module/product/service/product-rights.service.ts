import { userStorage, UserStorage } from '../../user/storage/user.storage';
import { UserModel } from '../../user/model/user.model';
import { ProductModel } from '../model/product.model';

export class ProductRightsService {

    private readonly userStorage: UserStorage;

    constructor () {
        this.userStorage = userStorage;
    }

    async hasRights(product : ProductModel) : Promise<boolean> {
        const user = this.userStorage.get() as UserModel; 
        return user.id === product.owner_id;
        
    }
}