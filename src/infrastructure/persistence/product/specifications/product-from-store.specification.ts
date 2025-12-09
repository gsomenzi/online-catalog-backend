import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import { ProductRecord } from "../product.record";

class ProductFromStoreSpecification implements Specification<ProductRecord> {
    constructor(private readonly _storeId: string) {}

    get storeId(): string {
        return this._storeId;
    }

    apply(qb: SelectQueryBuilder<ProductRecord>): SelectQueryBuilder<ProductRecord> {
        return qb.andWhere("product.store_id = :storeId", { storeId: this._storeId });
    }
}

export { ProductFromStoreSpecification };
