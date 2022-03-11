import { ProductModel } from '../model/product.model';
import { Connection, connection } from '../../../db/connection';
import { ServerErrorError } from '../../../error/server-error.error';
import { OrderForProductVo } from '../vo/order-for-product.vo';
import { SaleState } from '../vo/sale-state.vo';

export class ProductRepository {
    private readonly connection: Connection;

    constructor() {
        this.connection = connection;
    }

    async findOneById(id: number): Promise<ProductModel|null> {
        const sql = `SELECT * FROM product WHERE id = $1`;
        const source = await this.connection.fetchRow(sql, [id]);
        if (!source) {
            return null;
        }

        return <ProductModel>source;
    }

    async getCountByGalleryId(galleryId: number): Promise<number> {
        const sql = `SELECT COUNT(*) as amount FROM product WHERE gallery_id = $1`;
        const source = await this.connection.fetchScalar(sql, [galleryId]);
        if (!source) {
            return 0;
        }
        return source as number;
    }

    async findOneByParams(columns: object): Promise<ProductModel|null> {
        const findSql = this.getFindSql(columns);
        const source = await this.connection.fetchRow(findSql.sql, findSql.params);
        if (!source) {
            return null;
        }
        
        return <ProductModel>source;
    }


    async findLatestAuctionProducts(): Promise<Array<ProductModel>> {
        const sql = `SELECT * FROM product WHERE sale_state = $1 ORDER BY created_at DESC LIMIT 10`;
        const sources = await this.connection.fetchRows(sql, [SaleState.AUCTION]);
        return sources.map(source => <ProductModel>source);
    }


    async findLatestSallingProducts(): Promise<Array<ProductModel>> {
        const sql = `SELECT * FROM product WHERE sale_state = $1 ORDER BY created_at DESC LIMIT 10`;
        const sources = await this.connection.fetchRows(sql, [SaleState.DIRECT_SALE]);
        return sources.map(source => <ProductModel>source);
    }


    private getFindSql(columns: object, orderVo :OrderForProductVo | null = null): {sql: string, params: string[]} {
        let sqlParams : string[]= [];
        const sqlCondition = Object.keys(columns)
        .map((columnName: string, i: number) => {
            if (Array.isArray(columns[columnName])) {
                let result = ``;
                columns[columnName].forEach(element => {
                    sqlParams.push(element);
                    result += result ? `, $${sqlParams.length}` : `$${sqlParams.length}`;
                });
                return `"${columnName}" IN(${result})`;
            }
            sqlParams.push(columns[columnName]);
            return `"${columnName}" = $${ sqlParams.length}`
        })
        .join(' AND ');

        const order = orderVo ? orderVo.getorder() : null;
        return {
            sql: `SELECT * FROM product`
                + (sqlCondition ? ` WHERE ${sqlCondition}` : ``)
                + (order ? ` ORDER BY ${order}` : ``)
            ,
            params: sqlParams
        };
    }

    async findAllByParams(columns: object, orderVo: OrderForProductVo | null): Promise<Array<ProductModel>> {
        const findSql = this.getFindSql(columns, orderVo);
        const sources = await this.connection.fetchRows(findSql.sql, findSql.params);
        return sources.map(source => <ProductModel>source);
    }

    async insert(productModel: ProductModel): Promise<ProductModel> {
        try {
            return <ProductModel>await this.connection.insert('product', productModel);
        } catch {
            throw new ServerErrorError('Could not create product.');
        }
    }

    async update(productModel: ProductModel): Promise<ProductModel> {
        try {
            return <ProductModel>await this.connection.update('product', productModel);
        } catch (e) {
            throw new ServerErrorError('Could not update product.');
        }
    }
}

export const productRepository = new ProductRepository();
