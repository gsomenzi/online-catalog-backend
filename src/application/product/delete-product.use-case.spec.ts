import { beforeEach, describe, expect, it } from "bun:test";
import { Store } from "@domain/entity/store.entity";
import { ObjectNotFoundException } from "@domain/exception";
import { ProductInMemoryDAO, ProductRepository } from "@persistence/product";
import { StoreInMemoryDAO, StoreRepository } from "@persistence/store";
import { CreateProductUseCase } from "./create-product.use-case";
import { DeleteProductUseCase } from "./delete-product.use-case";

describe("DeleteProductUseCase", () => {
    let useCase: DeleteProductUseCase;
    let createProductUseCase: CreateProductUseCase;
    let productDAO: ProductInMemoryDAO;
    let productRepository: ProductRepository;
    let storeDAO: StoreInMemoryDAO;
    let storeRepository: StoreRepository;

    const userId = "user-123";
    const otherUserId = "user-456";
    let store: Store;

    beforeEach(async () => {
        storeDAO = new StoreInMemoryDAO();
        storeRepository = new StoreRepository(storeDAO);
        productDAO = new ProductInMemoryDAO(storeDAO);
        productRepository = new ProductRepository(productDAO);
        useCase = new DeleteProductUseCase(productRepository);
        createProductUseCase = new CreateProductUseCase(storeRepository, productRepository);

        store = Store.create({
            name: "Test Store",
            userId,
        });
        await storeRepository.create(store);
    });

    it("should delete product successfully", async () => {
        const product = await createProductUseCase.execute(
            { name: "Test Product", price: 99.99, storeId: store.id },
            userId
        );
        await useCase.execute(product.id, userId);
        const deletedProduct = await productRepository.findById(product.id);

        expect(deletedProduct).toBeNull();
    });

    it("should throw ObjectNotFoundException when product does not exist", async () => {
        const nonExistentId = "non-existent-id";

        expect(useCase.execute(nonExistentId, userId)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should throw ObjectNotFoundException when user tries to delete another user's product", async () => {
        const product = await createProductUseCase.execute(
            { name: "Test Product", price: 99.99, storeId: store.id },
            userId
        );

        expect(useCase.execute(product.id, otherUserId)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should not physically delete the product, only soft delete", async () => {
        const product = await createProductUseCase.execute(
            { name: "Test Product", price: 99.99, storeId: store.id },
            userId
        );
        await useCase.execute(product.id, userId);
        const allProducts = await productDAO.findMany();
        const deletedProduct = allProducts.find((p) => p.id === product.id);

        expect(deletedProduct).toBeDefined();
        expect(deletedProduct?.deletedAt).toBeInstanceOf(Date);
    });

    it("should allow deleting multiple products", async () => {
        const product1 = await createProductUseCase.execute(
            { name: "Product 1", price: 10.0, storeId: store.id },
            userId
        );
        const product2 = await createProductUseCase.execute(
            { name: "Product 2", price: 20.0, storeId: store.id },
            userId
        );
        const product3 = await createProductUseCase.execute(
            { name: "Product 3", price: 30.0, storeId: store.id },
            userId
        );
        await useCase.execute(product1.id, userId);
        await useCase.execute(product3.id, userId);
        const remainingProducts = await productRepository.findAll(store.id);

        expect(remainingProducts).toHaveLength(1);
        expect(remainingProducts[0].id).toBe(product2.id);
    });

    it("should throw error when trying to delete already deleted product", async () => {
        const product = await createProductUseCase.execute(
            { name: "Test Product", price: 99.99, storeId: store.id },
            userId
        );
        await useCase.execute(product.id, userId);

        expect(useCase.execute(product.id, userId)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should not affect products from other users", async () => {
        const otherUserStore = Store.create({
            name: "Other User Store",
            userId: otherUserId,
        });
        await storeRepository.create(otherUserStore);

        const userProduct = await createProductUseCase.execute(
            { name: "User Product", price: 10.0, storeId: store.id },
            userId
        );
        const otherUserProduct = await createProductUseCase.execute(
            { name: "Other User Product", price: 20.0, storeId: otherUserStore.id },
            otherUserId
        );
        await useCase.execute(userProduct.id, userId);
        const userProducts = await productRepository.findAll(store.id);
        const otherUserProducts = await productRepository.findAll(otherUserStore.id);

        expect(userProducts).toHaveLength(0);
        expect(otherUserProducts).toHaveLength(1);
        expect(otherUserProducts[0].id).toBe(otherUserProduct.id);
    });

    it("should not allow deleting product from another user's store", async () => {
        const otherUserStore = Store.create({
            name: "Other User Store",
            userId: otherUserId,
        });
        await storeRepository.create(otherUserStore);

        const otherUserProduct = await createProductUseCase.execute(
            { name: "Other User Product", price: 20.0, storeId: otherUserStore.id },
            otherUserId
        );

        expect(useCase.execute(otherUserProduct.id, userId)).rejects.toThrow(ObjectNotFoundException);
    });
});
