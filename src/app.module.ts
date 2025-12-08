import path from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./application/auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { PersistenceModule } from "./infrastructure/persistence/persistence.module";
import { RestApiModule } from "./presentation/rest-api/rest-api.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        DatabaseModule,
        PersistenceModule,
        RestApiModule,
        I18nModule.forRoot({
            fallbackLanguage: "pt-br",
            loaderOptions: {
                path: path.join(__dirname, "/config/i18n/"),
                watch: true,
            },
            resolvers: [{ use: QueryResolver, options: ["lang"] }, new HeaderResolver(["x-lang"])],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
