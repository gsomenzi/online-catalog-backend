import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard } from "@nestjs/throttler";
import { jwtConstants } from "@/config/auth.constants";
import { AuthGuard } from "@/config/auth.guard";
import { PersistenceModule } from "@/infrastructure/persistence/persistence.module";
import { SignInUseCase } from "./sign-in.use-case";
import { SignUpUseCase } from "./sign-up.use-case";

@Module({
    imports: [
        PersistenceModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "6h" },
        }),
    ],
    providers: [
        SignInUseCase,
        SignUpUseCase,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [SignInUseCase, SignUpUseCase],
})
export class AuthModule {}
