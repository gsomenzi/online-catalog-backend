import { Exclude } from "class-transformer";
import { ProductImage } from "./product-image.entity";
import { Store } from "./store.entity";

type ProductProps = {
    id: string;
    name: string;
    description?: string;
    price: number;
    storeId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    store?: Store;
    images?: ProductImage[];
};

export class Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    storeId: string;
    createdAt: Date;
    updatedAt: Date;
    @Exclude()
    deletedAt?: Date;
    store?: Store;
    images?: ProductImage[];

    constructor(props: ProductProps) {
        this.id = props.id;
        this.name = props.name;
        this.price = props.price;
        this.storeId = props.storeId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.description = props.description;
        this.deletedAt = props.deletedAt;
        this.store = props.store;
        this.images = props.images;
    }

    static create(props: Omit<ProductProps, "id" | "createdAt" | "updatedAt" | "deletedAt">): Product {
        return new Product({
            id: crypto.randomUUID(),
            name: props.name,
            description: props.description,
            price: props.price,
            storeId: props.storeId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
