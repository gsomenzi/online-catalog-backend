import { beforeEach, describe, expect, it, jest } from "bun:test";
import { ObjectNotFoundException } from "@domain/exception";
import { StoreInMemoryDAO, StoreRepository } from "@persistence/store";
import { AuthorizationService } from "@/infrastructure/authorization";
import { CreateStoreUseCase } from "./create-store.use-case";
import { DeleteStoreUseCase } from "./delete-store.use-case";

describe("DeleteStoreUseCase", () => {
    let useCase: DeleteStoreUseCase;
    let createStoreUseCase: CreateStoreUseCase;
    let storeDAO: StoreInMemoryDAO;
    let storeRepository: StoreRepository;
    let authorizationService: AuthorizationService;

    const user1 = { id: "user-123" };
    const user2 = { id: "user-456" };

    beforeEach(() => {
        storeDAO = new StoreInMemoryDAO();
        authorizationService = {
            authorize: jest.fn().mockResolvedValue({ isAllowed: true }),
            registerPolicy: jest.fn(),
            getPolicy: jest.fn(),
        };
        storeRepository = new StoreRepository(storeDAO);
        useCase = new DeleteStoreUseCase(authorizationService, storeRepository);
        createStoreUseCase = new CreateStoreUseCase(storeRepository);
    });

    it("should delete store successfully", async () => {
        const store = await createStoreUseCase.execute({ name: "My Store" }, user1.id);
        await useCase.execute(store.id, user1);
        const deletedStore = await storeRepository.findById(store.id);

        expect(deletedStore).toBeNull();
    });

    it("should throw ObjectNotFoundException when store does not exist", async () => {
        const nonExistentId = "non-existent-id";

        expect(useCase.execute(nonExistentId, user1)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should throw ObjectNotFoundException when user tries to delete another user's store", async () => {
        authorizationService.authorize = jest
            .fn()
            .mockResolvedValue({ isAllowed: false, reason: "User does not own the store" });
        const store = await createStoreUseCase.execute({ name: "My Store" }, user1.id);

        expect(useCase.execute(store.id, user2)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should not physically delete the store, only soft delete", async () => {
        const store = await createStoreUseCase.execute({ name: "My Store" }, user1.id);
        await useCase.execute(store.id, user1);
        const allStores = await storeDAO.findMany();
        const deletedStore = allStores.find((s) => s.id === store.id);

        expect(deletedStore).toBeDefined();
        expect(deletedStore?.deletedAt).toBeInstanceOf(Date);
    });

    it("should allow deleting multiple stores", async () => {
        const store1 = await createStoreUseCase.execute({ name: "Store 1" }, user1.id);
        const store2 = await createStoreUseCase.execute({ name: "Store 2" }, user1.id);
        const store3 = await createStoreUseCase.execute({ name: "Store 3" }, user1.id);
        await useCase.execute(store1.id, user1);
        await useCase.execute(store3.id, user1);
        const remainingStores = await storeRepository.findAll(user1.id);

        expect(remainingStores).toHaveLength(1);
        expect(remainingStores[0].id).toBe(store2.id);
    });

    it("should throw error when trying to delete already deleted store", async () => {
        const store = await createStoreUseCase.execute({ name: "My Store" }, user1.id);
        await useCase.execute(store.id, user1);

        expect(useCase.execute(store.id, user1)).rejects.toThrow(ObjectNotFoundException);
    });

    it("should not affect stores from other users", async () => {
        const userStore = await createStoreUseCase.execute({ name: "User Store" }, user1.id);
        const otherUserStore = await createStoreUseCase.execute({ name: "Other User Store" }, user2.id);
        await useCase.execute(userStore.id, user1);
        const userStores = await storeRepository.findAll(user1.id);
        const otherUserStores = await storeRepository.findAll(user2.id);

        expect(userStores).toHaveLength(0);
        expect(otherUserStores).toHaveLength(1);
        expect(otherUserStores[0].id).toBe(otherUserStore.id);
    });
});
