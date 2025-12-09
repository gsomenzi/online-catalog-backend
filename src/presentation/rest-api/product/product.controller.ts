import { CreateProductUseCase } from "@application/product/create-product.use-case";
import { Product } from "@domain/entity/product.entity";
import type { AuthenticatedRequest } from "@domain/value_object/auth/authenticated-request";
import { CreateProductRequest } from "@domain/value_object/product/create-product-request";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Controller("product")
export class ProductController {
    constructor(
        private createProductUseCase: CreateProductUseCase,
        @Inject(REQUEST) private readonly request: AuthenticatedRequest
    ) {}

    @Post()
    async create(@Body() dto: CreateProductRequest): Promise<Product> {
        return await this.createProductUseCase.execute(dto, this.request.user.id);
    }
}
