import { Body, Controller, Post } from "@nestjs/common";
import { SignInUseCase } from "@/application/auth/sign-in.use-case";
import { SignUpUseCase } from "@/application/auth/sign-up.use-case";
import { Public } from "@/config/public.decorator";
import { User } from "@/domain/entity/user.entity";
import { SignInRequest } from "@/domain/value_object/auth/sign-in-request";
import { SignInResponse } from "@/domain/value_object/auth/sign-in-response";
import { SignUpRequest } from "@/domain/value_object/auth/sign-up-request";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly signInUseCase: SignInUseCase,
        private readonly signUpUseCase: SignUpUseCase
    ) {}

    @Public()
    @Post("sign-in")
    async signIn(@Body() signInDTO: SignInRequest): Promise<SignInResponse> {
        return await this.signInUseCase.execute(signInDTO);
    }

    @Public()
    @Post("sign-up")
    async signUp(@Body() signUpDTO: SignUpRequest): Promise<User> {
        return await this.signUpUseCase.execute(signUpDTO);
    }
}
