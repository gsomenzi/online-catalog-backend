import { Module } from "@nestjs/common";
import { PersistenceModule } from "@/infrastructure/persistence/persistence.module";
import { CreateProductUseCase } from "./create-product.use-case";
import { DeleteProductUseCase } from "./delete-product.use-case";

@Module({
    imports: [PersistenceModule],
    providers: [CreateProductUseCase, DeleteProductUseCase],
    exports: [CreateProductUseCase, DeleteProductUseCase],
})
export class ProductModule {}
