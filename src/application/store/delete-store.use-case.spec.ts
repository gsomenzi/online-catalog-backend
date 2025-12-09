import { beforeEach, describe, expect, it } from "bun:test";
import { ObjectNotFoundException } from "@domain/exception";
import { StoreInMemoryDAO, StoreRepository } from "@persistence/store";
import { CreateStoreUseCase } from "./create-store.use-case";
import { DeleteStoreUseCase } from "./delete-store.use-case";

describe("DeleteStoreUseCase", () => {
    let useCase: DeleteStoreUseCase;
    let createStoreUseCase: CreateStoreUseCase;
    let storeDAO: StoreInMemoryDAO;
    let storeRepository: StoreRepository;

    const userId = "user-123";
    const otherUserId = "user-456";

    beforeEach(() => {
        storeDAO = new StoreInMemoryDAO();
        storeRepository = new StoreRepository(storeDAO);
        useCase = new DeleteStoreUseCase(storeRepository);
        createStoreUseCase = new CreateStoreUseCase(storeRepository);
    });

    it("should delete store successfully", async () => {
        const store = await createStoreUseCase.execute({ name: "My Store" }, userId);
        await useCase.execute(store.id, userId);
        const deletedStore = await storeRepository.findById(store.id);

        expect(deletedStore).toBeNull();
    });

    it("should throw ObjectNotFoundException when store does not exist", async () => {
        const nonExistentId = "non-existent-id";

        expect(useCase.execute(nonExistentId, userId)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should throw ObjectNotFoundException when user tries to delete another user's store", async () => {
        const store = await createStoreUseCase.execute({ name: "My Store" }, userId);

        expect(useCase.execute(store.id, otherUserId)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should not physically delete the store, only soft delete", async () => {
        const store = await createStoreUseCase.execute({ name: "My Store" }, userId);
        await useCase.execute(store.id, userId);
        const allStores = await storeDAO.findMany();
        const deletedStore = allStores.find((s) => s.id === store.id);

        expect(deletedStore).toBeDefined();
        expect(deletedStore?.deletedAt).toBeInstanceOf(Date);
    });

    it("should allow deleting multiple stores", async () => {
        const store1 = await createStoreUseCase.execute({ name: "Store 1" }, userId);
        const store2 = await createStoreUseCase.execute({ name: "Store 2" }, userId);
        const store3 = await createStoreUseCase.execute({ name: "Store 3" }, userId);
        await useCase.execute(store1.id, userId);
        await useCase.execute(store3.id, userId);
        const remainingStores = await storeRepository.findAll(userId);

        expect(remainingStores).toHaveLength(1);
        expect(remainingStores[0].id).toBe(store2.id);
    });

    it("should throw error when trying to delete already deleted store", async () => {
        const store = await createStoreUseCase.execute({ name: "My Store" }, userId);
        await useCase.execute(store.id, userId);

        expect(useCase.execute(store.id, userId)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should not affect stores from other users", async () => {
        const userStore = await createStoreUseCase.execute({ name: "User Store" }, userId);
        const otherUserStore = await createStoreUseCase.execute({ name: "Other User Store" }, otherUserId);
        await useCase.execute(userStore.id, userId);
        const userStores = await storeRepository.findAll(userId);
        const otherUserStores = await storeRepository.findAll(otherUserId);

        expect(userStores).toHaveLength(0);
        expect(otherUserStores).toHaveLength(1);
        expect(otherUserStores[0].id).toBe(otherUserStore.id);
    });
});
