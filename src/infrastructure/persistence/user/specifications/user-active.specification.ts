import type { SelectQueryBuilder } from "typeorm";
import type { UserRecord } from "@/infrastructure/persistence/user/user.record";
import type { Specification } from "../../../specification.interface";

class UserActiveSpecification implements Specification<UserRecord> {
    apply(qb: SelectQueryBuilder<UserRecord>): SelectQueryBuilder<UserRecord> {
        return qb.andWhere("user.deleted_at IS NULL");
    }
}

export { UserActiveSpecification };
