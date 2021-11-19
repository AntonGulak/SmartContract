import { UserModel } from '../model/user.model';
import { UserTokenModel } from '../model/user-token.model';

export class UserStorage {
    private user: UserModel|null = null;
    private userToken: UserTokenModel|null = null;

    get(): UserModel|null {
        return this.user;
    }

    getToken(): UserTokenModel|null {
        return this.userToken;
    }

    set(user: UserModel, userToken: UserTokenModel|null = null): void {
        this.user = user;
        this.userToken = userToken;
    }

    reset(): void {
        this.user = null;
        this.userToken = null;
    }
}

export const userStorage = new UserStorage();
