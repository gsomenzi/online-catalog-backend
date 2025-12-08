import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "@/config/auth.constants";
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
    providers: [SignInUseCase, SignUpUseCase],
    exports: [SignInUseCase, SignUpUseCase],
})
export class AuthModule {}
