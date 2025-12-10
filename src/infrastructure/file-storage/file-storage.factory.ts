import { ConfigService } from "@nestjs/config";
import { FileStorage } from "./file-storage.interface";
import { LocalFileStorage } from "./local-file-storage";

export const FILE_STORAGE = Symbol.for("FileStorage");

export class FileStorageFactory {
    static create(config: ConfigService): FileStorage {
        return new LocalFileStorage(config.get<string>("LOCAL_UPLOAD_PATH") || "./uploads");
    }
}

export const NestFileStorageFactory = {
    provide: FILE_STORAGE,
    useFactory: (config: ConfigService) => FileStorageFactory.create(config),
    inject: [ConfigService],
};
