import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { STORE_DAO_TOKEN, StoreDatabaseDAO, StoreRecord, StoreRepository } from "@persistence/store";
import { USER_DAO_TOKEN, UserDatabaseDAO, UserRecord, UserRepository } from "@persistence/user";

@Module({
    imports: [TypeOrmModule.forFeature([UserRecord, StoreRecord])],
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
    ],
    exports: [UserRepository, StoreRepository],
})
export class PersistenceModule {}
