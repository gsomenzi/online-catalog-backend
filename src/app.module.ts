import path from "node:path";
import { AuthModule } from "@application/auth/auth.module";
import { DatabaseModule } from "@config/database/database.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PersistenceModule } from "@persistence/persistence.module";
import { RestApiModule } from "@presentation/rest-api/rest-api.module";
import { HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { StoreModule } from "./application/store/store.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    name: "short",
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: "medium",
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: "long",
                    ttl: 60000,
                    limit: 100,
                },
            ],
        }),
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
        StoreModule,
    ],
})
export class AppModule {}
