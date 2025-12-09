import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import type { StoreRecord } from "@/infrastructure/persistence/store/store.record";

class StoreByIdSpecification implements Specification<StoreRecord> {
    constructor(private readonly id: string) {}

    apply(qb: SelectQueryBuilder<StoreRecord>): SelectQueryBuilder<StoreRecord> {
        return qb.andWhere("store.id = :id", { id: this.id });
    }
}

export { StoreByIdSpecification };
