import { Injectable } from "@nestjs/common";
import type { Specification } from "@persistence/specification.interface";
import { CreateUserRecordDTO, UpdateUserRecordDTO, type UserDAO, UserRecord } from "@persistence/user";
import { DataSource } from "typeorm";

@Injectable()
class UserDatabaseDAO implements UserDAO {
    constructor(private readonly dataSource: DataSource) {}

    async create(dto: CreateUserRecordDTO): Promise<void> {
        await this.dataSource.createQueryBuilder().insert().into(UserRecord).values(dto).execute();
    }

    async update(id: string, dto: UpdateUserRecordDTO): Promise<void> {
        await this.dataSource.createQueryBuilder().update(UserRecord).set(dto).where("id = :id", { id }).execute();
    }

    async delete(id: string): Promise<void> {
        await this.dataSource
            .createQueryBuilder()
            .update(UserRecord)
            .set({ deletedAt: new Date() })
            .where("id = :id", { id })
            .execute();
    }

    async findOne(...specs: Specification<UserRecord>[]): Promise<UserRecord | null> {
        let qb = this.dataSource.createQueryBuilder().select("user").from(UserRecord, "user");

        for (const spec of specs) {
            qb = spec.apply(qb);
        }

        return (await qb.getOne()) || null;
    }

    async findMany(...specs: Specification<UserRecord>[]): Promise<UserRecord[]> {
        let qb = this.dataSource.createQueryBuilder().select("user").from(UserRecord, "user");

        for (const spec of specs) {
            qb = spec.apply(qb);
        }

        return await qb.getMany();
    }
}

export { UserDatabaseDAO };
