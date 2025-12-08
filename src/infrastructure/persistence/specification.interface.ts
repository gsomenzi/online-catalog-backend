import type { ObjectLiteral, SelectQueryBuilder } from "typeorm";

interface Specification<T extends ObjectLiteral> {
    apply(qb: SelectQueryBuilder<T>): SelectQueryBuilder<T>;
}

export type { Specification };
