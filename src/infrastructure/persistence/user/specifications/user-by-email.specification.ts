import type { SelectQueryBuilder } from "typeorm";
import type { UserRecord } from "@/infrastructure/persistence/user/user.record";
import type { Specification } from "../../../specification.interface";

class UserByEmailSpecification implements Specification<UserRecord> {
    constructor(private readonly email: string) {}

    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.email = :email", { email: this.email });
    }
}

export { UserByEmailSpecification };
