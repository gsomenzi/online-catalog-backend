export type UploadResult = {
    fileId: string;
    url?: string;
    path: string;
    mimeType: string;
    size: number;
    filename: string;
    metadata?: Record<string, unknown>;
};
