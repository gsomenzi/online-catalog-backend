import { beforeEach, describe, expect, it } from "bun:test";
import { InvalidCredentialsException } from "@domain/exception/auth";
import type { SignInRequest } from "@domain/value_object/auth/sign-in-request";
import { JwtService } from "@nestjs/jwt";
import { UserInMemoryDAO, UserRepository } from "@persistence/user";
import { SignInUseCase } from "./sign-in.use-case";
import { SignUpUseCase } from "./sign-up.use-case";

describe("SignInUseCase", () => {
    let useCase: SignInUseCase;
    let signUpUseCase: SignUpUseCase;
    let userDAO: UserInMemoryDAO;
    let userRepository: UserRepository;
    let jwtService: JwtService;

    beforeEach(() => {
        userDAO = new UserInMemoryDAO();
        userRepository = new UserRepository(userDAO);
        jwtService = new JwtService({ secret: "test-secret" });
        useCase = new SignInUseCase(userRepository, jwtService);
        signUpUseCase = new SignUpUseCase(userRepository);
    });

    it("should authenticate user with valid credentials", async () => {
        const signInRequest: SignInRequest = {
            email: "john@example.com",
            password: "password123",
        };
        await signUpUseCase.execute({
            ...signInRequest,
            name: "John Doe",
        });
        const response = await useCase.execute(signInRequest);

        expect(response?.accessToken).toBeDefined();
        expect(typeof response.accessToken).toBe("string");
        expect(response.accessToken.length).toBeGreaterThan(0);
    });

    it("should throw InvalidCredentialsException when user does not exist", async () => {
        const signInRequest: SignInRequest = {
            email: "nonexistent@example.com",
            password: "password123",
        };

        expect(useCase.execute(signInRequest)).rejects.toThrow(InvalidCredentialsException);
    });

    it("should throw InvalidCredentialsException when password is incorrect", async () => {
        const signInRequest: SignInRequest = {
            email: "john@example.com",
            password: "wrongpassword",
        };
        await signUpUseCase.execute({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        });

        expect(useCase.execute(signInRequest)).rejects.toThrow(InvalidCredentialsException);
    });

    it("should generate valid JWT token with correct payload", async () => {
        const signInRequest: SignInRequest = {
            email: "john@example.com",
            password: "password123",
        };
        const user = await signUpUseCase.execute({
            ...signInRequest,
            name: "John Doe",
        });
        const response = await useCase.execute(signInRequest);

        const decoded = jwtService.verify(response.accessToken);
        expect(decoded).toBeDefined();
        expect(decoded.id).toBe(user.id);
        expect(decoded.email).toBe("john@example.com");
    });

    it("should not authenticate deleted user", async () => {
        const user = await signUpUseCase.execute({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        });

        await userRepository.delete(user.id);

        const request: SignInRequest = {
            email: "john@example.com",
            password: "password123",
        };

        expect(useCase.execute(request)).rejects.toThrow(InvalidCredentialsException);
    });

    it("should work with different users independently", async () => {
        const user1 = await signUpUseCase.execute({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        });

        const user2 = await signUpUseCase.execute({
            name: "Jane Doe",
            email: "jane@example.com",
            password: "password456",
        });

        const response1 = await useCase.execute({
            email: "john@example.com",
            password: "password123",
        });

        const response2 = await useCase.execute({
            email: "jane@example.com",
            password: "password456",
        });

        expect(response1.accessToken).not.toBe(response2.accessToken);

        const decoded1 = jwtService.verify(response1.accessToken);
        const decoded2 = jwtService.verify(response2.accessToken);

        expect(decoded1.id).toBe(user1.id);
        expect(decoded1.email).toBe("john@example.com");
        expect(decoded2.id).toBe(user2.id);
        expect(decoded2.email).toBe("jane@example.com");
    });
});
