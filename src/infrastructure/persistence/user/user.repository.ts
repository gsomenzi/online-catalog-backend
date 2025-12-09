import { User } from "@domain/entity/user.entity";
import type { UserCredentials } from "@domain/value_object/auth/user-credentials";
import { Inject, Injectable } from "@nestjs/common";
import {
    USER_DAO_TOKEN,
    UserActiveSpecification,
    UserByEmailSpecification,
    UserByIdSpecification,
    type UserDAO,
    UserRecord,
} from "@persistence/user";

@Injectable()
class UserRepository {
    constructor(@Inject(USER_DAO_TOKEN) private readonly userDAO: UserDAO) {}

    async create(user: User, hashedPassword: string): Promise<void> {
        const record = UserRecord.fromEntity(user, hashedPassword);
        await this.userDAO.create(record);
    }

    async update(user: User): Promise<void> {
        const record = UserRecord.fromEntity(user);
        await this.userDAO.update(user.id, record);
    }

    async delete(id: string): Promise<void> {
        await this.userDAO.delete(id);
    }

    async findById(id: string): Promise<User | null> {
        const record = await this.userDAO.findOne(new UserByIdSpecification(id), new UserActiveSpecification());
        return record ? UserRecord.toEntity(record) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const record = await this.userDAO.findOne(new UserByEmailSpecification(email), new UserActiveSpecification());
        return record ? UserRecord.toEntity(record) : null;
    }

    async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
        const record = await this.userDAO.findOne(new UserByEmailSpecification(email), new UserActiveSpecification());
        return record ? UserRecord.toCredentials(record) : null;
    }

    async findAll(): Promise<User[]> {
        const records = await this.userDAO.findMany(new UserActiveSpecification());
        return records.map(UserRecord.toEntity);
    }
}

export { UserRepository };
