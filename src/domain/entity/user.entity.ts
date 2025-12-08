import { randomUUID } from "node:crypto";
import { Exclude } from "class-transformer";

type CreateUserParams = {
    name: string;
    email: string;
    password: string;
};

type UserProps = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
};

class User {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    @Exclude()
    readonly password: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    @Exclude()
    readonly deletedAt?: Date;

    constructor(props: UserProps) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.password = props.password;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.deletedAt = props.deletedAt;
    }

    static async create(params: CreateUserParams): Promise<User> {
        const hashedPassword = await Bun.password.hash(params.password, {
            algorithm: "bcrypt",
            cost: 10,
        });

        return new User({
            id: randomUUID(),
            name: params.name,
            email: params.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    async validatePassword(plainPassword: string): Promise<boolean> {
        return Bun.password.verify(plainPassword, this.password);
    }
}

export { User };
export type { CreateUserParams, UserProps };
