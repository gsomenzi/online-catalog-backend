import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import { StoreRecord } from "../store.record";

class StoreFromUserSpecification implements Specification<StoreRecord> {
    constructor(private readonly _userId: string) {}

    get userId(): string {
        return this._userId;
    }

    apply(qb: SelectQueryBuilder<StoreRecord>): SelectQueryBuilder<StoreRecord> {
        return qb.andWhere("store.user.id = :userId", { userId: this._userId });
    }
}

export { StoreFromUserSpecification };
