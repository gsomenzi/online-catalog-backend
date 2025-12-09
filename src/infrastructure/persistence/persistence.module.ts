import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { STORE_DAO_TOKEN, StoreDatabaseDAO, StoreRecord, StoreRepository } from "@persistence/store";
import { USER_DAO_TOKEN, UserDatabaseDAO, UserRecord, UserRepository } from "@persistence/user";
import { PRODUCT_DAO_TOKEN, ProductDatabaseDAO, ProductRecord, ProductRepository } from "./product";

@Module({
    imports: [TypeOrmModule.forFeature([UserRecord, StoreRecord, ProductRecord])],
    providers: [
        UserDatabaseDAO,
        {
            provide: USER_DAO_TOKEN,
            useClass: UserDatabaseDAO,
        },
        UserRepository,
        StoreDatabaseDAO,
        {
            provide: STORE_DAO_TOKEN,
            useClass: StoreDatabaseDAO,
        },
        StoreRepository,
        ProductDatabaseDAO,
        {
            provide: PRODUCT_DAO_TOKEN,
            useClass: ProductDatabaseDAO,
        },
        ProductRepository,
    ],
    exports: [UserRepository, StoreRepository, ProductRepository],
})
export class PersistenceModule {}
