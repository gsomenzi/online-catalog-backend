import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDAO, UserRecord, UserRepository } from "@/infrastructure/persistence/user";

@Module({
    imports: [TypeOrmModule.forFeature([UserRecord])],
    providers: [UserDAO, UserRepository],
    exports: [UserRepository],
})
export class PersistenceModule {}
