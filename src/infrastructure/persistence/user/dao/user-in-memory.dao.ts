import { Injectable } from "@nestjs/common";
import type { Specification } from "@persistence/specification.interface";
import { type CreateUserRecordDTO, type UpdateUserRecordDTO, type UserDAO, UserRecord } from "@persistence/user";

@Injectable()
class UserInMemoryDAO implements UserDAO {
    private users: Map<string, UserRecord> = new Map();

    async create(dto: CreateUserRecordDTO): Promise<void> {
        const record = Object.assign(new UserRecord(), dto);
        this.users.set(record.id, record);
    }

    async update(id: string, dto: UpdateUserRecordDTO): Promise<void> {
        const existing = this.users.get(id);
        if (existing) {
            const updated = Object.assign(existing, dto);
            this.users.set(id, updated);
        }
    }

    async delete(id: string): Promise<void> {
        const existing = this.users.get(id);
        if (existing) {
            existing.deletedAt = new Date();
            this.users.set(id, existing);
        }
    }

    async findOne(...specs: Specification<UserRecord>[]): Promise<UserRecord | null> {
        const users = Array.from(this.users.values());

        for (const user of users) {
            let matches = true;
            for (const spec of specs) {
                if (!this.matchesSpecification(user, spec)) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                return user;
            }
        }

        return null;
    }

    async findMany(...specs: Specification<UserRecord>[]): Promise<UserRecord[]> {
        const users = Array.from(this.users.values());

        return users.filter((user) => {
            for (const spec of specs) {
                if (!this.matchesSpecification(user, spec)) {
                    return false;
                }
            }
            return true;
        });
    }

    clear(): void {
        this.users.clear();
    }

    private matchesSpecification(user: UserRecord, spec: Specification<UserRecord>): boolean {
        const specName = spec.constructor.name;

        if (specName === "UserActiveSpecification") {
            return user.deletedAt === null || user.deletedAt === undefined;
        }

        if (specName === "UserByEmailSpecification") {
            const emailSpec = spec as unknown as { email: string };
            return user.email === emailSpec.email;
        }

        if (specName === "UserByIdSpecification") {
            const idSpec = spec as unknown as { id: string };
            return user.id === idSpec.id;
        }

        return true;
    }
}

export { UserInMemoryDAO };
