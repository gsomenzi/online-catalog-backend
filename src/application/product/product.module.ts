import { Module } from "@nestjs/common";
import { PersistenceModule } from "@/infrastructure/persistence/persistence.module";
import { CreateProductUseCase } from "./create-product.use-case";

@Module({
    imports: [PersistenceModule],
    providers: [CreateProductUseCase],
    exports: [CreateProductUseCase],
})
export class ProductModule {}
