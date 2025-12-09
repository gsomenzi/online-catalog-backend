import { AuthModule } from "@application/auth/auth.module";
import { ProductModule } from "@application/product/product.module";
import { StoreModule } from "@application/store/store.module";
import { Module } from "@nestjs/common";
import { PersistenceModule } from "@persistence/persistence.module";
import { AuthController } from "./auth/auth.controller";
import { ProductController } from "./product/product.controller";
import { StoreController } from "./store/store.controller";

@Module({
    imports: [AuthModule, ProductModule, StoreModule, PersistenceModule],
    controllers: [AuthController, ProductController, StoreController],
})
export class RestApiModule {}
