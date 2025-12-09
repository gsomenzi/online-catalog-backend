import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import { ProductRecord } from "../product.record";

class ProductActiveSpecification implements Specification<ProductRecord> {
    apply(qb: SelectQueryBuilder<ProductRecord>): SelectQueryBuilder<ProductRecord> {
        return qb.andWhere("product.deleted_at IS NULL");
    }
}

export { ProductActiveSpecification };
