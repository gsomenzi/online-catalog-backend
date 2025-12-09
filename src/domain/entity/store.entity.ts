import { randomUUID } from "node:crypto";
import { Exclude } from "class-transformer";
import { User } from "./user.entity";

type StoreProps = {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    user?: User;
};

export class Store {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    @Exclude()
    deletedAt?: Date;
    user?: User;

    constructor(props: StoreProps) {
        this.id = props.id;
        this.name = props.name;
        this.userId = props.userId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.deletedAt = props.deletedAt;
        this.user = props.user;
    }

    static create(props: Pick<StoreProps, "name" | "userId">): Store {
        return new Store({
            id: randomUUID(),
            name: props.name,
            userId: props.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
