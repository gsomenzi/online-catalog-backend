import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./application/auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { PersistenceModule } from "./infrastructure/persistence/persistence.module";
import { RestApiModule } from "./presentation/rest-api/rest-api.module";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, PersistenceModule, AuthModule, RestApiModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
