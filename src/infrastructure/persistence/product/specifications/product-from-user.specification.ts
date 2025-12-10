import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import { ProductRecord } from "../product.record";

class ProductFromUserSpecification implements Specification<ProductRecord> {
    constructor(private readonly _userId: string) {}

    get userId(): string {
        return this._userId;
    }

    apply(qb: SelectQueryBuilder<ProductRecord>): SelectQueryBuilder<ProductRecord> {
        return qb.innerJoin("product.store", "store").andWhere("store.user_id = :userId", { userId: this._userId });
    }
}

export { ProductFromUserSpecification };
