import type { Specification } from "@persistence/specification.interface";
import type { UserRecord } from "@persistence/user";
import type { SelectQueryBuilder } from "typeorm";

class UserByEmailSpecification implements Specification<UserRecord> {
    constructor(private readonly _email: string) {}

    get email(): string {
        return this._email;
    }

    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.email = :email", { email: this._email });
    }
}

export { UserByEmailSpecification };
