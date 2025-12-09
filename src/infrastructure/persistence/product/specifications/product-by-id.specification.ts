import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import type { ProductRecord } from "@/infrastructure/persistence/product/product.record";

class ProductByIdSpecification implements Specification<ProductRecord> {
    constructor(private readonly _id: string) {}

    get id(): string {
        return this._id;
    }

    apply(qb: SelectQueryBuilder<ProductRecord>): SelectQueryBuilder<ProductRecord> {
        return qb.andWhere("product.id = :id", { id: this._id });
    }
}

export { ProductByIdSpecification };
