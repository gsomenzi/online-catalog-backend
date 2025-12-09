import { beforeEach, describe, expect, it } from "bun:test";
import type { CreateStoreRequest } from "@domain/value_object/store/create-store-request";
import { StoreInMemoryDAO, StoreRepository } from "@persistence/store";
import { CreateStoreUseCase } from "./create-store.use-case";

describe("CreateStoreUseCase", () => {
    let useCase: CreateStoreUseCase;
    let storeDAO: StoreInMemoryDAO;
    let storeRepository: StoreRepository;

    const userId = "user-123";

    beforeEach(() => {
        storeDAO = new StoreInMemoryDAO();
        storeRepository = new StoreRepository(storeDAO);
        useCase = new CreateStoreUseCase(storeRepository);
    });

    it("should create a new store successfully", async () => {
        const request: CreateStoreRequest = {
            name: "My Store",
        };
        const store = await useCase.execute(request, userId);

        expect(store?.id).toBeDefined();
        expect(store?.name).toBe("My Store");
        expect(store?.userId).toBe(userId);
        expect(store?.createdAt).toBeInstanceOf(Date);
        expect(store?.updatedAt).toBeInstanceOf(Date);
        expect(store?.deletedAt).toBeUndefined();
    });

    it("should create store with unique id", async () => {
        const request: CreateStoreRequest = {
            name: "Store 1",
        };
        const store1 = await useCase.execute(request, userId);
        const store2 = await useCase.execute({ name: "Store 2" }, userId);

        expect(store1.id).not.toBe(store2.id);
    });

    it("should persist the store in repository", async () => {
        const request: CreateStoreRequest = {
            name: "My Store",
        };
        const createdStore = await useCase.execute(request, userId);
        const foundStore = await storeRepository.findById(createdStore.id);

        expect(foundStore).toBeDefined();
        expect(foundStore?.id).toBe(createdStore.id);
        expect(foundStore?.name).toBe("My Store");
        expect(foundStore?.userId).toBe(userId);
    });

    it("should allow multiple stores for same user", async () => {
        await useCase.execute({ name: "Store 1" }, userId);
        await useCase.execute({ name: "Store 2" }, userId);
        await useCase.execute({ name: "Store 3" }, userId);
        const stores = await storeRepository.findAll(userId);

        expect(stores).toHaveLength(3);
        expect(stores.map((s) => s.name)).toEqual(["Store 1", "Store 2", "Store 3"]);
    });

    it("should allow different users to create stores with same name", async () => {
        const user1 = "user-1";
        const user2 = "user-2";
        const store1 = await useCase.execute({ name: "My Store" }, user1);
        const store2 = await useCase.execute({ name: "My Store" }, user2);

        expect(store1.userId).toBe(user1);
        expect(store2.userId).toBe(user2);
        expect(store1.id).not.toBe(store2.id);
    });
});
