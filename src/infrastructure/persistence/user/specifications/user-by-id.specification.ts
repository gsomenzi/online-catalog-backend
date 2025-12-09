import type { Specification } from "@persistence/specification.interface";
import type { UserRecord } from "@persistence/user";
import type { SelectQueryBuilder } from "typeorm";

class UserByIdSpecification implements Specification<UserRecord> {
    constructor(private readonly _id: string) {}

    get id(): string {
        return this._id;
    }

    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.id = :id", { id: this._id });
    }
}

export { UserByIdSpecification };
