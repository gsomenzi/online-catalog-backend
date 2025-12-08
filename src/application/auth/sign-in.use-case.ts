import { InvalidCredentialsException } from "@domain/exception/auth";
import { PasswordService } from "@domain/service/password.service";
import { SignInRequest } from "@domain/value_object/auth/sign-in-request";
import { SignInResponse } from "@domain/value_object/auth/sign-in-response";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "@persistence/user";

@Injectable()
export class SignInUseCase {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    public async execute(dto: SignInRequest): Promise<SignInResponse> {
        const { email, password } = dto;
        const credentials = await this.userRepository.findCredentialsByEmail(email);
        if (!credentials) {
            throw new InvalidCredentialsException();
        }
        const isPasswordValid = await PasswordService.verify(password, credentials.hashedPassword);
        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }
        const payload = { sub: credentials.userId, email: credentials.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
