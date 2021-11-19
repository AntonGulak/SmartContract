import { CommandContract } from '../../../contract/command.contract';
import { Request } from 'express';
import { MeResponseDto } from './response-dto/me.response-dto';
import { userStorage, UserStorage } from '../storage/user.storage';
import { UserModel } from '../model/user.model';

export class MeCommand extends CommandContract {
    private readonly userStorage: UserStorage;

    constructor() {
        super();
        this.onlyAuthorized = true;
        this.userStorage = userStorage;
    }

    async run(req: Request): Promise<any> {
        const user = this.userStorage.get() as UserModel;
        return <MeResponseDto>{
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            token_expire_at: this.userStorage.getToken()?.expired_at,
            account_type: user.account_type,
            role: user.role,
            owner_for_id: user.owner_for_id
        };
    }
}
