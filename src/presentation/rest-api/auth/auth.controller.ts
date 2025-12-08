import { Body, Controller, Post } from "@nestjs/common";
import { SignInRequestDTO, SignInUseCase } from "@/application/auth/sign-in.use-case";
import { SignUpDTO, SignUpUseCase } from "@/application/auth/sign-up.use-case";
import { User } from "@/domain/entity/user.entity";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly signInUseCase: SignInUseCase,
        private readonly signUpUseCase: SignUpUseCase
    ) {}

    @Post("sign-in")
    async signIn(@Body() signInDTO: SignInRequestDTO): Promise<User> {
        return await this.signInUseCase.execute(signInDTO);
    }

    @Post("sign-up")
    async signUp(@Body() signUpDTO: SignUpDTO): Promise<User> {
        return await this.signUpUseCase.execute(signUpDTO);
    }
}
