import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import { StoreRecord } from "../store.record";

class StoreActiveSpecification implements Specification<StoreRecord> {
    apply(qb: SelectQueryBuilder<StoreRecord>): SelectQueryBuilder<StoreRecord> {
        return qb.andWhere("store.deleted_at IS NULL");
    }
}

export { StoreActiveSpecification };
