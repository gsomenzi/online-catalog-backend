import * as fs from "node:fs";
import { applyDecorators, BadRequestException, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";

const ONE_MB = 1024 * 1024;
const MAX_FILE_SIZE = 10 * ONE_MB;

interface FileUploadOptions {
    fieldName?: string;
    destination?: string;
    maxFileSize?: number;
    allowedMimeTypes?: string[];
}

export function FileUpload(options: FileUploadOptions = {}) {
    const {
        fieldName = "image",
        destination = "./uploads/",
        maxFileSize = MAX_FILE_SIZE,
        allowedMimeTypes = ["image/"],
    } = options;

    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: multer.diskStorage({
                    destination: (_req, _file, cb) => {
                        createDestinationFolder(destination);
                        cb(null, destination);
                    },
                    filename: (_, file, cb) => {
                        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                        cb(null, `${uniqueSuffix}-${file.originalname}`);
                    },
                }),
                limits: { fileSize: maxFileSize },
                fileFilter: (_, file, cb) => {
                    const isAllowed = allowedMimeTypes.some((type) => file.mimetype.startsWith(type));
                    if (isAllowed) {
                        cb(null, true);
                    } else {
                        cb(
                            new BadRequestException(`Only files of type ${allowedMimeTypes.join(", ")} are allowed!`),
                            false
                        );
                    }
                },
            })
        )
    );
}

function createDestinationFolder(destination: string) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }
}
