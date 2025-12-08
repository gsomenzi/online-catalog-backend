import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User, type UserProps } from "@/domain/entity/user.entity";
import type { UserCredentials } from "@/domain/value_object/auth/user-credentials";

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

    static fromEntity(user: User, hashedPassword?: string): UserRecord {
        const record = new UserRecord();
        record.id = user.id;
        record.name = user.name;
        record.email = user.email;
        if (hashedPassword) {
            record.password = hashedPassword;
        }
        record.createdAt = user.createdAt;
        record.updatedAt = user.updatedAt;
        record.deletedAt = user.deletedAt;
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
