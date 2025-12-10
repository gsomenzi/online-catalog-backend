import { beforeEach, describe, expect, it } from "bun:test";
import { Store } from "@domain/entity/store.entity";
import { StoreNotFoundException } from "@domain/exception";
import type { CreateProductRequest } from "@domain/value_object/product/create-product-request";
import { ProductInMemoryDAO, ProductRepository } from "@persistence/product";
import { StoreInMemoryDAO, StoreRepository } from "@persistence/store";
import { CreateProductUseCase } from "./create-product.use-case";

describe("CreateProductUseCase", () => {
    let useCase: CreateProductUseCase;
    let productDAO: ProductInMemoryDAO;
    let productRepository: ProductRepository;
    let storeDAO: StoreInMemoryDAO;
    let storeRepository: StoreRepository;

    const userId = "user-123";
    let store: Store;

    beforeEach(async () => {
        storeDAO = new StoreInMemoryDAO();
        productDAO = new ProductInMemoryDAO();
        storeRepository = new StoreRepository(storeDAO);
        productRepository = new ProductRepository(productDAO);
        useCase = new CreateProductUseCase(storeRepository, productRepository);

        store = Store.create({
            name: "Test Store",
            userId,
        });
        await storeRepository.create(store);
    });

    it("should create a new product successfully", async () => {
        const request: CreateProductRequest = {
            name: "Test Product",
            description: "Test Description",
            price: 99.99,
            storeId: store.id,
        };
        const product = await useCase.execute(request, userId);

        expect(product?.id).toBeDefined();
        expect(product?.name).toBe("Test Product");
        expect(product?.description).toBe("Test Description");
        expect(product?.price).toBe(99.99);
        expect(product?.storeId).toBe(store.id);
        expect(product?.createdAt).toBeInstanceOf(Date);
        expect(product?.updatedAt).toBeInstanceOf(Date);
        expect(product?.deletedAt).toBeUndefined();
    });

    it("should create product without description", async () => {
        const request: CreateProductRequest = {
            name: "Test Product",
            price: 49.99,
            storeId: store.id,
        };
        const product = await useCase.execute(request, userId);

        expect(product?.id).toBeDefined();
        expect(product?.name).toBe("Test Product");
        expect(product?.description).toBeUndefined();
        expect(product?.price).toBe(49.99);
    });

    it("should create product with unique id", async () => {
        const request: CreateProductRequest = {
            name: "Product 1",
            price: 10.0,
            storeId: store.id,
        };
        const product1 = await useCase.execute(request, userId);
        const product2 = await useCase.execute({ name: "Product 2", price: 20.0, storeId: store.id }, userId);

        expect(product1.id).not.toBe(product2.id);
    });

    it("should persist the product in repository", async () => {
        const request: CreateProductRequest = {
            name: "Test Product",
            price: 99.99,
            storeId: store.id,
        };
        const createdProduct = await useCase.execute(request, userId);
        const foundProduct = await productRepository.findById(createdProduct.id);

        expect(foundProduct).toBeDefined();
        expect(foundProduct?.id).toBe(createdProduct.id);
        expect(foundProduct?.name).toBe("Test Product");
        expect(foundProduct?.price).toBe(99.99);
        expect(foundProduct?.storeId).toBe(store.id);
    });

    it("should allow multiple products for same store", async () => {
        await useCase.execute({ name: "Product 1", price: 10.0, storeId: store.id }, userId);
        await useCase.execute({ name: "Product 2", price: 20.0, storeId: store.id }, userId);
        await useCase.execute({ name: "Product 3", price: 30.0, storeId: store.id }, userId);
        const products = await productRepository.findAll(store.id);

        expect(products).toHaveLength(3);
        expect(products.map((p) => p.name)).toEqual(["Product 1", "Product 2", "Product 3"]);
    });

    it("should throw StoreNotFoundException when store does not exist", async () => {
        const request: CreateProductRequest = {
            name: "Test Product",
            price: 99.99,
            storeId: "non-existent-store",
        };

        expect(useCase.execute(request, userId)).rejects.toThrow(StoreNotFoundException);
    });

    it("should throw StoreNotFoundException when user does not own the store", async () => {
        const otherUserId = "user-456";
        const request: CreateProductRequest = {
            name: "Test Product",
            price: 99.99,
            storeId: store.id,
        };

        expect(useCase.execute(request, otherUserId)).rejects.toThrow(StoreNotFoundException);
    });

    it("should allow different stores to have products with same name", async () => {
        const otherStore = Store.create({
            name: "Other Store",
            userId,
        });
        await storeRepository.create(otherStore);

        const product1 = await useCase.execute({ name: "Product", price: 10.0, storeId: store.id }, userId);
        const product2 = await useCase.execute({ name: "Product", price: 20.0, storeId: otherStore.id }, userId);

        expect(product1.storeId).toBe(store.id);
        expect(product2.storeId).toBe(otherStore.id);
        expect(product1.id).not.toBe(product2.id);
        expect(product1.price).toBe(10.0);
        expect(product2.price).toBe(20.0);
    });
});
