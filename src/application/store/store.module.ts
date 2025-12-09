import { Module } from "@nestjs/common";
import { PersistenceModule } from "@/infrastructure/persistence/persistence.module";
import { CreateStoreUseCase } from "./create-store.use-case";
import { DeleteStoreUseCase } from "./delete-store.use-case";

@Module({
    imports: [PersistenceModule],
    providers: [CreateStoreUseCase, DeleteStoreUseCase],
    exports: [CreateStoreUseCase, DeleteStoreUseCase],
})
export class StoreModule {}
