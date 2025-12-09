import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreDAO, StoreRecord, StoreRepository } from "@persistence/store";
import { UserDAO, UserRecord, UserRepository } from "@persistence/user";

@Module({
    imports: [TypeOrmModule.forFeature([UserRecord, StoreRecord])],
    providers: [UserDAO, UserRepository, StoreDAO, StoreRepository],
    exports: [UserRepository, StoreRepository],
})
export class PersistenceModule {}
