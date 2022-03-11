import { userStorage, UserStorage } from '../storage/user.storage';
import { NextFunction, Request, Response } from 'express';
import { userRepository, UserRepository } from '../repository/user.repository';
import { userTokenRepository, UserTokenRepository } from '../repository/user-token.repository';

export class AuthorizeUserInterceptor {
    private readonly userStorage: UserStorage;
    private readonly userRepository: UserRepository;
    private readonly userTokenRepository: UserTokenRepository;

    constructor() {
        this.userStorage = userStorage;
        this.userRepository = userRepository;
        this.userTokenRepository = userTokenRepository;
    }

    async intercept(req: Request, res: Response, next: NextFunction) {
        this.userStorage.reset();
        const authorizationHeader = req.get('Authorization');
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.substr(7);
            const userToken = await this.userTokenRepository.findOneNotExpiredByToken(token);
            if (userToken) {
                const user = await this.userRepository.findOneById(userToken.user_id);
                if (user) {
                    this.userStorage.set(user, userToken);
                }
            }
        }
        next();
    }
}
