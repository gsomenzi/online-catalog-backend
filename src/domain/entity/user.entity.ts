import { randomUUID } from "node:crypto";
import { Exclude } from "class-transformer";

export type UserProps = {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
};

export class User {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    @Exclude()
    readonly deletedAt?: Date;

    constructor(props: UserProps) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.deletedAt = props.deletedAt;
    }

    static create(props: Pick<UserProps, "name" | "email">): User {
        return new User({
            id: randomUUID(),
            name: props.name,
            email: props.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
