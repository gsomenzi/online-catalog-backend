import { CreateStoreUseCase } from "@application/store/create-store.use-case";
import { Store } from "@domain/entity/store.entity";
import { type AuthenticatedRequest } from "@domain/value_object/auth/authenticated-request";
import { CreateStoreRequest } from "@domain/value_object/store/create-store-request";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { StoreRepository } from "@persistence/store";
import { DeleteStoreUseCase } from "@/application/store/delete-store.use-case";

@Controller("store")
export class StoreController {
    constructor(
        private createStoreUseCase: CreateStoreUseCase,
        private deleteStoreUseCase: DeleteStoreUseCase,
        private readonly storeRepository: StoreRepository,
        @Inject(REQUEST) private readonly request: AuthenticatedRequest
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateStoreRequest): Promise<Store> {
        const store = await this.createStoreUseCase.execute(dto, this.request.user.id);
        return store;
    }

    @Get()
    async findAll(): Promise<Store[]> {
        const stores = await this.storeRepository.findAll(this.request.user.id);
        return stores;
    }

    @Get(":id")
    async findById(@Param("id") id: string): Promise<Store | null> {
        const store = await this.storeRepository.findUserStoreById(this.request.user.id, id);
        return store;
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param("id") storeId: string): Promise<void> {
        await this.deleteStoreUseCase.execute(storeId, this.request.user.id);
    }
}
