import { Body, Controller, Post } from "@nestjs/common";
import { seconds, Throttle } from "@nestjs/throttler";
import { SignInUseCase } from "@/application/auth/sign-in.use-case";
import { SignUpUseCase } from "@/application/auth/sign-up.use-case";
import { Public } from "@/config/public.decorator";
import { User } from "@/domain/entity/user.entity";
import { SignInRequest } from "@/domain/value_object/auth/sign-in-request";
import { SignInResponse } from "@/domain/value_object/auth/sign-in-response";
import { SignUpRequest } from "@/domain/value_object/auth/sign-up-request";

const ONE_MINUTE = seconds(60);

@Controller("auth")
export class AuthController {
    constructor(
        private readonly signInUseCase: SignInUseCase,
        private readonly signUpUseCase: SignUpUseCase
    ) {}

    @Public()
    @Post("sign-in")
    @Throttle({ short: { ttl: ONE_MINUTE, limit: 5 } })
    async signIn(@Body() signInDTO: SignInRequest): Promise<SignInResponse> {
        return await this.signInUseCase.execute(signInDTO);
    }

    @Public()
    @Post("sign-up")
    @Throttle({ short: { ttl: ONE_MINUTE, limit: 3 } })
    async signUp(@Body() signUpDTO: SignUpRequest): Promise<User> {
        return await this.signUpUseCase.execute(signUpDTO);
    }
}
