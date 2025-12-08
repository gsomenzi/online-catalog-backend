import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import type { UserRecord } from "@/infrastructure/persistence/user/user.record";

class UserByIdSpecification implements Specification<UserRecord> {
    constructor(private readonly id: string) {}

    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.id = :id", { id: this.id });
    }
}

export { UserByIdSpecification };
