import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User, type UserProps } from "@/domain/entity/user.entity";

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

    static fromEntity(user: User): UserRecord {
        const record = new UserRecord();
        record.id = user.id;
        record.name = user.name;
        record.email = user.email;
        record.password = user.password;
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
            password: record.password,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            deletedAt: record.deletedAt,
        };
        return new User(userProps);
    }
}

export { UserRecord };
