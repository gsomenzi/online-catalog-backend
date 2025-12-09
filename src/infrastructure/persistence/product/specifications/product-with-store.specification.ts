import { SelectQueryBuilder } from "typeorm";
import { Specification } from "../../specification.interface";
import { ProductRecord } from "../product.record";

class ProductWithStoreSpecification implements Specification<ProductRecord> {
    apply(qb: SelectQueryBuilder<ProductRecord>): SelectQueryBuilder<ProductRecord> {
        return qb.leftJoinAndSelect("product.store", "store");
    }
}

export { ProductWithStoreSpecification };
