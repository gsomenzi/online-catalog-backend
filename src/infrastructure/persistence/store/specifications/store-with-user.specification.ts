import { SelectQueryBuilder } from "typeorm";
import { Specification } from "../../specification.interface";
import { StoreRecord } from "../store.record";

class StoreWithUserSpecification implements Specification<StoreRecord> {
    apply(qb: SelectQueryBuilder<StoreRecord>): SelectQueryBuilder<StoreRecord> {
        return qb.leftJoinAndSelect("store.user", "user");
    }
}

export { StoreWithUserSpecification };
