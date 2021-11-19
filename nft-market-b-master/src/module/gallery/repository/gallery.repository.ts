import { GalleryModel } from '../model/gallery.model';
import { Connection, connection } from '../../../db/connection';
import { ServerErrorError } from '../../../error/server-error.error';

export class GalleryRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async findOneById(id: number): Promise<GalleryModel|null> {
        const sql = `SELECT * FROM gallery WHERE id = $1`;
        const source = await this.connection.fetchRow(sql, [id]);
        if (!source) {
            return null;
        }

        return <GalleryModel>source;
    }


    async findOneByOwnerId(id: number): Promise<GalleryModel|null> {
        const sql = `SELECT * FROM gallery WHERE owner_id = $1`;
        const source = await this.connection.fetchRow(sql, [id]);
        if (!source) {
            return null;
        }

        return <GalleryModel>source;
    }

    async findAll(): Promise<Array<GalleryModel>> {
        const sql = `SELECT * FROM gallery`;
        const sources = await this.connection.fetchRows(sql, []);
        return sources.map(source => <GalleryModel>source);
    }

    async insert(galleryModel: GalleryModel): Promise<GalleryModel> {
        try {
            return <GalleryModel>await this.connection.insert('gallery', galleryModel);
        } catch {
            throw new ServerErrorError('Could not create gallery.');
        }
    }

    async update(galleryModel: GalleryModel): Promise<GalleryModel> {
        try {
            return <GalleryModel>await this.connection.update('gallery', galleryModel);
        } catch (e) {
            throw new ServerErrorError('Could not update gallery.');
        }
    }
}

export const galleryRepository = new GalleryRepository();
