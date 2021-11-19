import { UserModel } from '../model/user.model';
import { UserTokenModel } from '../model/user-token.model';
import * as jwt from 'jsonwebtoken';
import { secure } from '../../../config/secure';
import { userTokenRepository, UserTokenRepository } from '../repository/user-token.repository';

export class GenerateUserTokenService {
    private readonly userTokenRepository: UserTokenRepository;

    constructor() {
        this.userTokenRepository = userTokenRepository;
    }

    async generate(user: UserModel): Promise<string> {
        const expiredAt = Math.floor(Date.now() / 1000) + secure.tokenLifeTime;
        const token = await jwt.sign({
            exp: expiredAt,
            data: user.email,
        }, secure.tokenSalt);

        const userToken = <UserTokenModel>{
            user_id: user.id,
            token: token,
            expired_at: new Date(expiredAt * 1000).toDateString(),
        };

        await this.userTokenRepository.insert(userToken);
        return token;
    }
}
