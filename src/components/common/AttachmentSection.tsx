import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@components/ui/card.tsx";
import { Upload, Paperclip, Trash2, FileText, Image, FileArchive, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { commonAttachmentApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { useToastApp } from "@/hooks/use-toast-app";
import type {
    AttachmentApiGetAttachmentsByReferenceRequest,
    AttachmentApiCreateAttachmentRequest,
    AttachmentApiDeleteAttachmentRequest,
    AttachmentRequest,
    AttachmentResponse,
} from "@/api/generated/common/api";


export interface AttachmentSectionProps {
    companyId: string;
    referenceId: string;
    referenceType: string;
    isReadOnly?: boolean;
}

/** Trả về icon phù hợp với loại file */
function getFileIcon(fileName: string) {
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return <Image className="w-4 h-4 " />;
    if (["xlsx", "xls", "csv"].includes(ext)) return <FileSpreadsheet className="w-4 h-4 " />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return <FileArchive className="w-4 h-4 " />;
    return <FileText className="w-4 h-4 " />;
}

/** Format kích thước file sang dạng đọc được */
function formatFileSize(bytes?: number): string {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function AttachmentSection({
    companyId,
    referenceId,
    referenceType,
    isReadOnly = false,
}: AttachmentSectionProps) {
    const { user } = useAuth();
    const { success, error } = useToastApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    // ─── Load danh sách file đính kèm ────────────────────────────────────────
    const loadAttachments = useCallback(async () => {
        if (!referenceId || !referenceType) return;

        setIsLoading(true);
        try {
            const request: AttachmentApiGetAttachmentsByReferenceRequest = {
                xCompanyId: companyId ?? "",
                referenceType,
                referenceId,
            };
            const response = await commonAttachmentApi.getAttachmentsByReference(request);
            // Unwrap standard response wrapper: { status, message, data: [...] }
            const data = response.data?.data ?? [];
            setAttachments(data);
        } catch (err) {
            console.error("Lỗi khi tải tệp đính kèm:", err);
            error("Không thể tải danh sách tệp đính kèm.");
        } finally {
            setIsLoading(false);
        }
    }, [companyId, referenceId, referenceType]);

    useEffect(() => {
        loadAttachments();
    }, [loadAttachments]);

    // ─── Upload file ──────────────────────────────────────────────────────────
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        // Reset input để có thể chọn cùng file lần sau
        if (fileInputRef.current) fileInputRef.current.value = "";

        for (const file of files) {
            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        const fileKey = `${file.name}-${file.size}-${Date.now()}`;
        setUploadingFiles((prev) => new Set(prev).add(fileKey));

        try {
            // TODO: Nếu backend yêu cầu upload lên storage trước (S3/MinIO),
            //       thực hiện bước đó ở đây và lấy `fileUrl` từ response.
            //       Hiện tại giả định backend nhận metadata và tự xử lý storage.
            const attachmentRequest: AttachmentRequest = {
                referenceId,
                referenceType,
                fileName: file.name,
                fileType: file.type || file.name.split(".").pop() || "",
                fileSize: file.size,
                fileUrl: "dfsafas", // Sẽ được điền sau khi upload lên storage
            };

            const request: AttachmentApiCreateAttachmentRequest = {
                xCompanyId: companyId ?? "",
                xUserId: user?.id ?? "",
                attachmentRequest,
            };

            const response = await commonAttachmentApi.createAttachment(request);
            const newAttachment = response.data?.data;

            if (newAttachment) {
                setAttachments((prev) => [newAttachment, ...prev]);
                success(`Đã tải lên "${file.name}" thành công.`);
            }
        } catch (err) {
            console.error("Lỗi khi tải lên file:", err);
            error(`Không thể tải lên "${file.name}". Vui lòng thử lại.`);
        } finally {
            setUploadingFiles((prev) => {
                const next = new Set(prev);
                next.delete(fileKey);
                return next;
            });
        }
    };

    // ─── Xóa file ─────────────────────────────────────────────────────────────
    const handleDelete = async (attachment: AttachmentResponse) => {
        if (!attachment.id) return;

        setDeletingIds((prev) => new Set(prev).add(attachment.id!));
        try {
            const request: AttachmentApiDeleteAttachmentRequest = {
                xCompanyId: companyId ?? "",
                id: attachment.id,
            };
            await commonAttachmentApi.deleteAttachment(request);
            setAttachments((prev) => prev.filter((a) => a.id !== attachment.id));
            success(`Đã xóa "${attachment.fileName}".`);
        } catch (err) {
            console.error("Lỗi khi xóa file:", err);
            error(`Không thể xóa "${attachment.fileName}". Vui lòng thử lại.`);
        } finally {
            setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(attachment.id!);
                return next;
            });
        }
    };

    // ─── Drag & Drop ──────────────────────────────────────────────────────────
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (isReadOnly) return;
        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            await uploadFile(file);
        }
    };

    const isUploading = uploadingFiles.size > 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <CardTitle>Tệp đính kèm</CardTitle>
                </div>
                <CardDescription>
                    {isLoading
                        ? "Đang tải..."
                        : `${attachments.length} tệp đính kèm cho ${referenceType}`}
                </CardDescription>
                <CardAction>
                    {!isReadOnly && (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                                aria-label="Chọn file để tải lên"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {isUploading ? `Đang tải (${uploadingFiles.size})...` : "Tải lên"}
                            </Button>
                        </>
                    )}
                </CardAction>
            </CardHeader>

            <CardContent>
                {/* Khu vực kéo thả */}
                {!isReadOnly && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            mb-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                            transition-colors duration-200 select-none
                            ${isDragging
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground"
                            }
                        `}
                    >
                        <Upload className="w-6 h-6 mx-auto mb-2 opacity-60" />
                        <p className="text-sm font-medium">Kéo thả file vào đây hoặc nhấn để chọn</p>
                        <p className="text-xs mt-1 opacity-60">Hỗ trợ nhiều file cùng lúc</p>
                    </div>
                )}

                {/* Danh sách file */}
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
                        ))}
                    </div>
                ) : attachments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Paperclip className="w-8 h-8 mb-2 opacity-30" />
                        <p className="text-sm">Chưa có tệp đính kèm nào</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {attachments.map((att) => {
                            const isDeleting = att.id ? deletingIds.has(att.id) : false;
                            return (
                                <li
                                    key={att.id}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-md border
                                        bg-muted/30 hover:bg-muted/60 transition-colors
                                        ${isDeleting ? "opacity-50 pointer-events-none" : ""}
                                    `}
                                >
                                    {/* Icon file */}
                                    <span className="shrink-0">
                                        {getFileIcon(att.fileName ?? "")}
                                    </span>

                                    {/* Thông tin file */}
                                    <div className="flex-1 min-w-0">
                                        {att.fileUrl ? (
                                            <a
                                                href={att.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium truncate block hover:underline text-foreground"
                                                title={att.fileName}
                                            >
                                                {att.fileName}
                                            </a>
                                        ) : (
                                            <span
                                                className="text-sm font-medium truncate block text-foreground"
                                                title={att.fileName}
                                            >
                                                {att.fileName}
                                            </span>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {formatFileSize(att.fileSize)}
                                            {att.createdByName && ` · ${att.createdByName}`}
                                            {att.createdAt && ` · ${new Date(att.createdAt).toLocaleDateString("vi-VN")}`}
                                        </p>
                                    </div>

                                    {/* Nút xóa */}
                                    {!isReadOnly && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive"
                                            disabled={isDeleting}
                                            onClick={() => handleDelete(att)}
                                            aria-label={`Xóa ${att.fileName}`}
                                        >
                                            {isDeleting ? (
                                                <X className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Upload progress indicators */}
                {isUploading && (
                    <div className="mt-3 space-y-1">
                        {Array.from(uploadingFiles).map((key) => (
                            <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary animate-pulse rounded-full w-2/3" />
                                </div>
                                <span>Đang tải lên...</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
