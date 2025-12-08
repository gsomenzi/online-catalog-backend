import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import type { UserRecord } from "@/infrastructure/persistence/user/user.record";

class UserByEmailSpecification implements Specification<UserRecord> {
    constructor(private readonly email: string) {}

    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.email = :email", { email: this.email });
    }
}

export { UserByEmailSpecification };
