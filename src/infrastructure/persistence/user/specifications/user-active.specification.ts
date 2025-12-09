import type { Specification } from "@persistence/specification.interface";
import type { UserRecord } from "@persistence/user";
import type { SelectQueryBuilder } from "typeorm";

class UserActiveSpecification implements Specification<UserRecord> {
    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.deleted_at IS NULL");
    }
}

export { UserActiveSpecification };
