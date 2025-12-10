import { Inject, Injectable } from "@nestjs/common";
import { Product } from "@/domain/entity/product.entity";
import type { ProductDAO } from "./dao/product.dao";
import { PRODUCT_DAO_TOKEN } from "./dao/product.dao";
import { ProductRecord } from "./product.record";
import { ProductActiveSpecification } from "./specifications/product-active.specification";
import { ProductByIdSpecification } from "./specifications/product-by-id.specification";
import { ProductFromStoreSpecification } from "./specifications/product-from-store.specification";
import { ProductFromUserSpecification } from "./specifications/product-from-user.specification";

@Injectable()
class ProductRepository {
    constructor(@Inject(PRODUCT_DAO_TOKEN) private readonly productDAO: ProductDAO) {}

    async create(product: Product): Promise<void> {
        const record = ProductRecord.fromEntity(product);
        await this.productDAO.create(record);
    }

    async update(product: Product): Promise<void> {
        const record = ProductRecord.fromEntity(product);
        await this.productDAO.update(product.id, record);
    }

    async delete(id: string): Promise<void> {
        await this.productDAO.delete(id);
    }

    async findById(id: string): Promise<Product | null> {
        const record = await this.productDAO.findOne(
            new ProductByIdSpecification(id),
            new ProductActiveSpecification()
        );
        return record ? ProductRecord.toEntity(record) : null;
    }

    async findStoreProductById(storeId: string, productId: string): Promise<Product | null> {
        const record = await this.productDAO.findOne(
            new ProductByIdSpecification(productId),
            new ProductFromStoreSpecification(storeId),
            new ProductActiveSpecification()
        );
        return record ? ProductRecord.toEntity(record) : null;
    }

    async findUserProductById(userId: string, productId: string): Promise<Product | null> {
        const record = await this.productDAO.findOne(
            new ProductByIdSpecification(productId),
            new ProductFromUserSpecification(userId),
            new ProductActiveSpecification()
        );
        return record ? ProductRecord.toEntity(record) : null;
    }

    async findAll(storeId: string): Promise<Product[]> {
        const records = await this.productDAO.findMany(
            new ProductFromStoreSpecification(storeId),
            new ProductActiveSpecification()
        );
        return records.map(ProductRecord.toEntity);
    }
}

export { ProductRepository };
