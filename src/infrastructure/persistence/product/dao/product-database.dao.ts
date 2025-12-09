import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { ProductDAO } from "@/infrastructure/persistence/product/dao/product.dao";
import { CreateProductRecordDTO, UpdateProductRecordDTO } from "@/infrastructure/persistence/product/dto";
import { ProductRecord } from "@/infrastructure/persistence/product/product.record";
import type { Specification } from "@/infrastructure/persistence/specification.interface";

@Injectable()
class ProductDatabaseDAO implements ProductDAO {
    constructor(private readonly dataSource: DataSource) {}

    async create(dto: CreateProductRecordDTO): Promise<void> {
        await this.dataSource.createQueryBuilder().insert().into(ProductRecord).values(dto).execute();
    }

    async update(id: string, dto: UpdateProductRecordDTO): Promise<void> {
        await this.dataSource.createQueryBuilder().update(ProductRecord).set(dto).where("id = :id", { id }).execute();
    }

    async delete(id: string): Promise<void> {
        await this.dataSource
            .createQueryBuilder()
            .update(ProductRecord)
            .set({ deletedAt: new Date() })
            .where("id = :id", { id })
            .execute();
    }

    async findOne(...specs: Specification<ProductRecord>[]): Promise<ProductRecord | null> {
        let qb = this.dataSource.createQueryBuilder().select("product").from(ProductRecord, "product");

        for (const spec of specs) {
            qb = spec.apply(qb);
        }

        return (await qb.getOne()) || null;
    }

    async findMany(...specs: Specification<ProductRecord>[]): Promise<ProductRecord[]> {
        let qb = this.dataSource.createQueryBuilder().select("product").from(ProductRecord, "product");

        for (const spec of specs) {
            qb = spec.apply(qb);
        }

        return await qb.getMany();
    }
}

export { ProductDatabaseDAO };
