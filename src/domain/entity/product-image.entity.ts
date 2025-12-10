type ProductImageProps = {
    id: string;
    productId: string;
    filePath: string;
    fileName: string;
    mimeType: string;
    size: number;
    createdAt: Date;
};

export class ProductImage {
    id: string;
    productId: string;
    filePath: string;
    fileName: string;
    mimeType: string;
    size: number;
    createdAt: Date;

    constructor(props: ProductImageProps) {
        this.id = props.id;
        this.productId = props.productId;
        this.filePath = props.filePath;
        this.fileName = props.fileName;
        this.mimeType = props.mimeType;
        this.size = props.size;
        this.createdAt = props.createdAt;
    }

    static create(props: Omit<ProductImageProps, "id" | "createdAt">): ProductImage {
        return new ProductImage({
            id: crypto.randomUUID(),
            productId: props.productId,
            filePath: props.filePath,
            fileName: props.fileName,
            mimeType: props.mimeType,
            size: props.size,
            createdAt: new Date(),
        });
    }

    getFileExtension(): string {
        const parts = this.fileName.split(".");
        const extension = parts.pop();
        return extension ?? "";
    }
}
