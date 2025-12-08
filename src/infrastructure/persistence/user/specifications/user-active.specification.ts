import type { Specification } from "@persistence/specification.interface";
import type { SelectQueryBuilder } from "typeorm";
import type { UserRecord } from "@/infrastructure/persistence/user/user.record";

class UserActiveSpecification implements Specification<UserRecord> {
    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.deleted_at IS NULL");
    }
}

export { UserActiveSpecification };
