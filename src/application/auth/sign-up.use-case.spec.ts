import { beforeEach, describe, expect, it } from "bun:test";
import { EmailAlreadyInUseException } from "@domain/exception/auth";
import type { SignUpRequest } from "@domain/value_object/auth/sign-up-request";
import { UserInMemoryDAO, UserRepository } from "@persistence/user";
import { SignUpUseCase } from "./sign-up.use-case";

describe("SignUpUseCase", () => {
    let useCase: SignUpUseCase;
    let userDAO: UserInMemoryDAO;
    let userRepository: UserRepository;

    beforeEach(() => {
        userDAO = new UserInMemoryDAO();
        userRepository = new UserRepository(userDAO);
        useCase = new SignUpUseCase(userRepository);
    });

    it("should create a new user successfully", async () => {
        const request: SignUpRequest = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        };
        const user = await useCase.execute(request);

        expect(user).toBeDefined();
        expect(user.id).toBeDefined();
        expect(user.name).toBe("John Doe");
        expect(user.email).toBe("john@example.com");
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it("should throw EmailAlreadyInUseException when email already exists", async () => {
        const request: SignUpRequest = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        };
        await useCase.execute(request);
        const existingUser = await userRepository.findByEmail("john@example.com");

        expect(existingUser).toBeDefined();
        expect(useCase.execute(request)).rejects.toThrow(EmailAlreadyInUseException);
    });

    it("should hash the password before storing", async () => {
        const request: SignUpRequest = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        };
        await useCase.execute(request);
        const credentials = await userRepository.findCredentialsByEmail("john@example.com");

        expect(credentials).toBeDefined();
        expect(credentials?.hashedPassword).not.toBe("password123");
    });

    it("should create user with unique id", async () => {
        const request1: SignUpRequest = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        };

        const request2: SignUpRequest = {
            name: "Jane Doe",
            email: "jane@example.com",
            password: "password456",
        };
        const user1 = await useCase.execute(request1);
        const user2 = await useCase.execute(request2);

        expect(user1.id).not.toBe(user2.id);
    });
});
