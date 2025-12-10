import { SelectQueryBuilder } from "typeorm";
import { Specification } from "../../specification.interface";
import { StoreRecord } from "../store.record";

class StoreWithProductsSpecification implements Specification<StoreRecord> {
    apply(qb: SelectQueryBuilder<StoreRecord>): SelectQueryBuilder<StoreRecord> {
        return qb.leftJoinAndSelect("store.products", "products");
    }
}

export { StoreWithProductsSpecification };
