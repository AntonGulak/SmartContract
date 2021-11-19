import { userStorage, UserStorage } from '../../user/storage/user.storage';
import { UserModel } from '../../user/model/user.model';
import { GalleryModel } from '../model/gallery.model';
import { UserRole } from '../../user/vo/user-role.vo';

export class GalleryRightsService {

    private readonly userStorage: UserStorage;

    constructor () {
        this.userStorage = userStorage;
    }

    async hasRights(gallery : GalleryModel) : Promise<boolean> {
        const user = this.userStorage.get() as UserModel; 
        return user.id === gallery.owner_id || (new UserRole(user.role)).isAdmin();
        
    }
}