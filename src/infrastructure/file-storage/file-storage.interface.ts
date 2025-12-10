import { UploadOptions } from "./value_objects/upload-options";
import { UploadResult } from "./value_objects/upload-result";

export interface FileStorage {
    upload(buffer: Buffer, filename: string, mimeType: string, opts?: UploadOptions): Promise<UploadResult>;
    delete(fileIdOrPath: string): Promise<void>;
    getStream?(fileIdOrPath: string): NodeJS.ReadableStream;
}
