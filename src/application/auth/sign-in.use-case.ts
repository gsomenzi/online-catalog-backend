import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "@persistence/user";
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
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
