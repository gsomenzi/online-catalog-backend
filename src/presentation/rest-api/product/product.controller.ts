import { CreateProductUseCase } from "@application/product/create-product.use-case";
import { DeleteProductUseCase } from "@application/product/delete-product.use-case";
import { FileUpload } from "@config/file-upload.decorator";
import { Product } from "@domain/entity/product.entity";
import type { AuthenticatedRequest } from "@domain/value_object/auth/authenticated-request";
import { CreateProductRequest } from "@domain/value_object/product/create-product-request";
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    UploadedFile,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Controller("product")
export class ProductController {
    constructor(
        private createProductUseCase: CreateProductUseCase,
        private deleteProductUseCase: DeleteProductUseCase,
        @Inject(REQUEST) private readonly request: AuthenticatedRequest
    ) {}

    @Post()
    async create(@Body() dto: CreateProductRequest): Promise<Product> {
        return await this.createProductUseCase.execute(dto, this.request.user.id);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id") id: string): Promise<void> {
        return await this.deleteProductUseCase.execute(id, this.request.user.id);
    }

    @Post(":id/image")
    @FileUpload({
        fieldName: "image",
        allowedMimeTypes: ["image/"],
    })
    async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<void> {
        if (!file) {
            throw new BadRequestException("No file uploaded");
        }
        console.log(`Uploaded file: ${file.originalname}, size: ${file.size} bytes`);
    }
}
