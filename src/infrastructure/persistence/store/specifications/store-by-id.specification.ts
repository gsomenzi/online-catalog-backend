import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import type { StoreRecord } from "@/infrastructure/persistence/store/store.record";

class StoreByIdSpecification implements Specification<StoreRecord> {
    constructor(private readonly _id: string) {}

    get id(): string {
        return this._id;
    }

    apply(qb: SelectQueryBuilder<StoreRecord>): SelectQueryBuilder<StoreRecord> {
        return qb.andWhere("store.id = :id", { id: this._id });
    }
}

export { StoreByIdSpecification };
