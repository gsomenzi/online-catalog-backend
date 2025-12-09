import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import { StoreRecord } from "../store.record";

class StoreFromUserSpecification implements Specification<StoreRecord> {
    constructor(private readonly userId: string) {}
    apply(qb: SelectQueryBuilder<StoreRecord>): SelectQueryBuilder<StoreRecord> {
        return qb.andWhere("store.user.id = :userId", { userId: this.userId });
    }
}

export { StoreFromUserSpecification };
