import { createReadStream, promises as fs } from "node:fs";
import * as path from "node:path";
import { v4 as uuid } from "uuid";
import { FileStorage } from "./file-storage.interface";
import { UploadOptions } from "./value_objects/upload-options";
import { UploadResult } from "./value_objects/upload-result";

export class LocalFileStorage implements FileStorage {
    constructor(private basePath: string) {}

    async upload(buffer: Buffer, filename: string, mimeType: string, opts?: UploadOptions): Promise<UploadResult> {
        const id = uuid();
        const ext = path.extname(filename) || "";
        const safeName = `${id}${ext}`;

        const folder = opts?.folder ? path.join(this.basePath, opts.folder) : this.basePath;
        await fs.mkdir(folder, { recursive: true });

        const filePath = path.join(folder, safeName);
        await fs.writeFile(filePath, buffer);

        return {
            fileId: id,
            path: filePath,
            filename: safeName,
            mimeType,
            size: buffer.length,
        };
    }

    async delete(filePath: string): Promise<void> {
        try {
            await fs.unlink(filePath);
        } catch {}
    }

    getStream(filePath: string) {
        return createReadStream(filePath);
    }
}
