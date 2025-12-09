import { Injectable } from "@nestjs/common";
import { Product } from "@/domain/entity/product.entity";
import { StoreNotFoundException } from "@/domain/exception";
import { CreateProductRequest } from "@/domain/value_object/product/create-product-request";
import { ProductRepository } from "@/infrastructure/persistence/product";
import { StoreRepository } from "@/infrastructure/persistence/store";

@Injectable()
export class CreateProductUseCase {
    constructor(
        private storeRepository: StoreRepository,
        private productRepository: ProductRepository
    ) {}
    async execute(dto: CreateProductRequest, userId: string): Promise<Product> {
        const store = await this.storeRepository.findUserStoreById(userId, dto.storeId);
        if (!store) {
            throw new StoreNotFoundException();
        }
        const product = Product.create({
            name: dto.name,
            description: dto.description,
            price: dto.price,
            storeId: store.id,
        });
        await this.productRepository.create(product);
        return product;
    }
}
