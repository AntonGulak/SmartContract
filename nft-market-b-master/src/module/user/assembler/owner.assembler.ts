import { OwnerDto } from './dto/owner.dto';
import { UserRepository, userRepository } from '../repository/user.repository';

export class OwnerAssembler {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = userRepository;
    }

    async assemble(ownerId: number): Promise<OwnerDto> {
        const owner: OwnerDto = {
            id: 0,
            username: '',
            first_name: '',
            last_name: '',
            avatar: '',
            wallet: '',
        };

        if (ownerId) {
            const ownerModel = await this.userRepository.findOneById(ownerId);
            if (ownerModel) {
                owner.id = ownerModel.id;
                owner.username = ownerModel.username;
                owner.first_name = ownerModel.first_name;
                owner.last_name = ownerModel.last_name;
                owner.avatar = ownerModel.avatar;
                owner.wallet = ownerModel.wallet;
            }
        }

        return owner;
    }
}
