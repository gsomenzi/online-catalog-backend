import { User, type UserProps } from "@domain/entity/user.entity";
import type { UserCredentials } from "@domain/value_object/auth/user-credentials";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
class UserRecord {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;

    static fromEntity(entity: User, hashedPassword?: string): UserRecord {
        const record = new UserRecord();
        record.id = entity.id;
        record.name = entity.name;
        record.email = entity.email;
        if (hashedPassword) {
            record.password = hashedPassword;
        }
        record.createdAt = entity.createdAt;
        record.updatedAt = entity.updatedAt;
        record.deletedAt = entity.deletedAt;
        return record;
    }

    static toEntity(record: UserRecord): User {
        const userProps: UserProps = {
            id: record.id,
            name: record.name,
            email: record.email,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            deletedAt: record.deletedAt,
        };
        return new User(userProps);
    }

    static toCredentials(record: UserRecord): UserCredentials {
        return {
            userId: record.id,
            email: record.email,
            hashedPassword: record.password,
        };
    }
}

export { UserRecord };
