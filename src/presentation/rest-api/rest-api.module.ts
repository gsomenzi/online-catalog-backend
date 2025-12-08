import { Module } from "@nestjs/common";
import { AuthModule } from "@/application/auth/auth.module";
import { AuthController } from "./auth/auth.controller";

@Module({
    imports: [AuthModule],
    controllers: [AuthController],
})
export class RestApiModule {}
