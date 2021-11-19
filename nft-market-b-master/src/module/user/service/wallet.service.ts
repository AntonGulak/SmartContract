import { UserModel } from "../model/user.model";
import { UserRepository, userRepository } from "../repository/user.repository";

export class WalletService {
    private readonly userRepository : UserRepository

    constructor() {
        this.userRepository = userRepository;
    }

    async getOrCreateUser(wallet: string) {
        const user = await userRepository.findOneByWallet(wallet);
        if (user) {
            return user;
        }

        return this.createUser(wallet);
    }

    private createUser(wallet: string): Promise<UserModel> {
        const userModel = <UserModel>{
            wallet: wallet,
            active: false,
        };
        return this.userRepository.insert(userModel);
    }
}