export type UploadOptions = {
    folder?: string;
    acl?: "public-read" | "private";
    cacheControl?: string;
    tags?: Record<string, string>;
};
