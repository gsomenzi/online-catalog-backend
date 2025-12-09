import { AuthModule } from "@application/auth/auth.module";
import { StoreModule } from "@application/store/store.module";
import { Module } from "@nestjs/common";
import { PersistenceModule } from "@persistence/persistence.module";
import { AuthController } from "./auth/auth.controller";
import { StoreController } from "./store/store.controller";

@Module({
    imports: [AuthModule, StoreModule, PersistenceModule],
    controllers: [AuthController, StoreController],
})
export class RestApiModule {}
