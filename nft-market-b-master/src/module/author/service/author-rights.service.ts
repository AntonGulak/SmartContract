import { userStorage, UserStorage } from '../../user/storage/user.storage';
import { UserModel } from '../../user/model/user.model';
import { UserRole } from '../../user/vo/user-role.vo';
import { AuthorModel } from '../model/author.model';
import { GalleryRepository, galleryRepository } from '../../gallery/repository/gallery.repository';

export class AuthorRightsService {

    private readonly userStorage: UserStorage;
    private galleryRepository: GalleryRepository;

    constructor () {
        this.userStorage = userStorage;
        this.galleryRepository = galleryRepository;
    }

    async hasRightsToAdd() : Promise<boolean> {
        const user = this.userStorage.get() as UserModel; 
        if ((new UserRole(user.role)).isAdmin()) {
            return true;
        }
        return !! await this.galleryRepository.findOneByOwnerId(user.id);
    }

    async getGalleryId(galleryId: number) : Promise<number> {
        const user = this.userStorage.get() as UserModel; 
        if ((new UserRole(user.role)).isAdmin()) {
            return galleryId;
        }
        const gallery = await this.galleryRepository.findOneByOwnerId(user.id);
        return gallery?.id as number;
    }


    async hasRightsToEdit(author : AuthorModel) : Promise<boolean> {
        const user = this.userStorage.get() as UserModel; 
        if ((new UserRole(user.role)).isAdmin()) {
            return true;
        }
        const galleryOfUser = await this.galleryRepository.findOneByOwnerId(user.id);
        return (galleryOfUser && galleryOfUser.id == author.gallery_id) ? true : false;
    }
}