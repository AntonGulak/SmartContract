import { UserModel } from '../model/user.model';
import { connection, Connection } from '../../../db/connection';
import { ServerErrorError } from '../../../error/server-error.error';
import { AccountType } from '../vo/account-type.vo';

export class UserRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async findGalleryOwner(galleryId: number): Promise<UserModel | null> {
        const sql = `SELECT * FROM "user" WHERE "account_type" = $1 AND owner_for_id = $2`;
        const source = await this.connection.fetchRow(sql, [AccountType.GALLERY, galleryId]);
        if (!source) {
            return null;
        }

        return <UserModel>source;
    }

    async findOneBy(fieldName: string, value: string | number): Promise<UserModel | null> {
        const sql = `SELECT * FROM "user" WHERE "${fieldName}" = $1`;
        const source = await this.connection.fetchRow(sql, [value]);
        if (!source) {
            return null;
        }

        return <UserModel>source;
    }
    findOneById(id: number): Promise<UserModel|null> {
        return this.findOneBy('id', id);
    }

    
    findOneByWallet(wallet: string): Promise<UserModel|null> {
        return this.findOneBy('wallet', wallet);
    }

    findOneByEmail(email: string): Promise<UserModel|null> {
        return this.findOneBy('email', email);
    }

    async insert(userModel: UserModel): Promise<UserModel> {
        try {
            return <UserModel>await this.connection.insert('user', userModel);
        } catch {
            throw new ServerErrorError('Could not create user.');
        }
    }
}

export const userRepository = new UserRepository();
