import { connection, Connection } from '../../../db/connection';
import { ServerErrorError } from '../../../error/server-error.error';
import { UserTokenModel } from '../model/user-token.model';

export class UserTokenRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async insert(userToken: UserTokenModel): Promise<UserTokenModel> {
        try {
            return <UserTokenModel>await this.connection.insert('user_token', userToken);
        } catch {
            throw new ServerErrorError('Could not create user token.');
        }
    }

    async findOneNotExpiredByToken(token: string): Promise<UserTokenModel|null> {
        const sql = `SELECT * FROM "user_token" WHERE token = $1 AND expired_at >= NOW()`;
        const source = await this.connection.fetchRow(sql, [token]);
        if (!source) {
            return null;
        }

        return <UserTokenModel>source;
    }
}

export const userTokenRepository = new UserTokenRepository();
