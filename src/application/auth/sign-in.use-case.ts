import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "@persistence/user";
import { PasswordService } from "@/domain/service/password.service";
import { SignInRequest } from "@/domain/value_object/auth/sign-in-request";
import { SignInResponse } from "@/domain/value_object/auth/sign-in-response";

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
            throw new UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await PasswordService.verify(password, credentials.hashedPassword);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }
        const payload = { sub: credentials.userId, email: credentials.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
