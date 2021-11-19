import { AuthorModel } from '../model/author.model';
import { Connection, connection } from '../../../db/connection';
import { ServerErrorError } from '../../../error/server-error.error';

export class AuthorRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }
    async findAll(): Promise<AuthorModel[]> {
        const sql = `SELECT * FROM author`;
        const sources = await this.connection.fetchRows(sql, []);
        return sources.map(source => <AuthorModel>source);
    }

    async findAllToUnAuth(): Promise<AuthorModel[]> {
        const sql = `SELECT * FROM author WHERE "gallery_id" = 6`;
        const sources = await this.connection.fetchRows(sql, []);
        return sources.map(source => <AuthorModel>source);
    }

    async findAllByGalleryId(galleryId: number): Promise<AuthorModel[]> {
        const sql = `SELECT * FROM author WHERE "gallery_id" = $1`;
        const sources = await this.connection.fetchRows(sql, [galleryId]);
        return sources.map(source => <AuthorModel>source);
    }

    async findOneById(id: number): Promise<AuthorModel|null> {
        const sql = `SELECT * FROM author WHERE id = $1`;
        const source = await this.connection.fetchRow(sql, [id]);
        if (!source) {
            return null;
        }

        return <AuthorModel>source;
    }


    async findOneByUserId(userId: number): Promise<AuthorModel|null> {
        const sql = `SELECT * FROM author WHERE user_id = $1 ORDER BY created_at DESC`;
        const source = await this.connection.fetchRow(sql, [userId]);
        if (!source) {
            return null;
        }

        return <AuthorModel>source;
    }

    async insert(authorModel: AuthorModel): Promise<AuthorModel> {
        try {
            return <AuthorModel>await this.connection.insert('author', authorModel);
        } catch {
            throw new ServerErrorError('Could not create author.');
        }
    }

    async update(authorModel: AuthorModel): Promise<AuthorModel> {
        try {
            return <AuthorModel>await this.connection.update('author', authorModel);
        } catch (e) {
            throw new ServerErrorError('Could not update Author.');
        }
    }
}

export const authorRepository = new AuthorRepository();
