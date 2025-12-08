import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "@persistence/user";
import { IsNotEmpty } from "class-validator";

export class SignInRequestDTO {
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
}

export class SignInResponseDTO {
    accessToken: string;
}

@Injectable()
export class SignInUseCase {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    public async execute(dto: SignInRequestDTO): Promise<SignInResponseDTO> {
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
