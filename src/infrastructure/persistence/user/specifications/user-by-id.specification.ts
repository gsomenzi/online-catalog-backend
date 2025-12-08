import type { SelectQueryBuilder } from "typeorm";
import type { UserRecord } from "@/infrastructure/persistence/user/user.record";
import type { Specification } from "../../../specification.interface";

class UserByIdSpecification implements Specification<UserRecord> {
    constructor(private readonly id: string) {}

    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.id = :id", { id: this.id });
    }
}

export { UserByIdSpecification };
