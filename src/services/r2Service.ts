import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME || "efms-bucket";
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

export const r2Service = {
    /**
     * Uploads a file to Cloudflare R2 and returns the file URL.
     * @param file The file to upload.
     * @param folder An optional folder path (e.g. "attachments").
     * @returns The public or access URL of the uploaded file.
     */
    async uploadFile(file: File, folder: string = "attachments"): Promise<string> {
        if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
            console.warn("R2 configuration is missing. Ensure VITE_R2_* variables are set in .env");
        }

        const extension = file.name.split('.').pop() || "";
        const baseName = file.name.replace(`.${extension}`, "").replace(/[^a-zA-Z0-9_-]/g, "");
        const uniqueFileName = `${baseName}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

        const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: new Uint8Array(await file.arrayBuffer()),
            ContentType: file.type || "application/octet-stream",
        });

        await s3Client.send(command);

        // Return the public URL if configured, otherwise a default structured URL
        if (R2_PUBLIC_URL) {
            const baseUrl = R2_PUBLIC_URL.endsWith('/') ? R2_PUBLIC_URL.slice(0, -1) : R2_PUBLIC_URL;
            return `${baseUrl}/${key}`;
        }

        // This is a placeholder URL format if a custom domain isn't provided.
        // It's recommended to configure a custom domain or access URL in production.
        return `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    },

    /**
     * Xóa một file trên Cloudflare R2 dựa trên URL của file.
     * @param fileUrl URL của file cần xóa.
     */
    async deleteFile(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        try {
            const urlObj = new URL(fileUrl);
            let key = urlObj.pathname;
            if (key.startsWith('/')) {
                key = key.substring(1); // Remove leading slash
            }

            const command = new DeleteObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: decodeURIComponent(key),
            });

            await s3Client.send(command);
            console.log(`Đã xóa file trên R2: ${key}`);
        } catch (error) {
            console.error("Lỗi khi xóa file trên R2:", error);
        }
    }
};
