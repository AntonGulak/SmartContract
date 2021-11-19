import { ModuleContract } from '../contract/module.contract';
import { ProductModule } from '../module/product/product.module';
import { Type } from '../contract/type.contract';
import { ProductsModule } from '../module/products/products.module';
import { AuthModule } from '../module/auth/auth.module';
import { AuthorModule } from '../module/author/author.module';
import { UserModule } from "../module/user/user.module";
import { NftModule } from '../module/nft/nft.module';
import { GalleryModule } from '../module/gallery/gallery.module';
import { DbModule } from '../module/db/db.module';

const moduleClasses: Array<Type<ModuleContract>> = [
    ProductModule,
    ProductsModule,
    AuthModule,
    UserModule,
    NftModule,
    AuthorModule,
    GalleryModule,
    DbModule
];

export const modules = moduleClasses.map(moduleClass => new moduleClass());
