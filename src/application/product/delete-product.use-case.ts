import { Injectable } from "@nestjs/common";
import { ObjectNotFoundException } from "@/domain/exception";
import { ProductRepository } from "@/infrastructure/persistence/product";

@Injectable()
export class DeleteProductUseCase {
    constructor(private productRepository: ProductRepository) {}
    async execute(productId: string, userId: string): Promise<void> {
        const product = await this.productRepository.findUserProductById(userId, productId);
        if (!product) {
            throw new ObjectNotFoundException();
        }
        await this.productRepository.delete(productId);
    }
}
