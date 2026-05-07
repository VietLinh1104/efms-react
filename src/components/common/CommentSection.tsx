"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@components/ui/card.tsx";
import { MessageSquare, Send, Trash2, X } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import TextareaAutosize from "react-textarea-autosize";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group";
import { useCallback, useEffect, useState } from "react";
import { commonCommentApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { useToastApp } from "@/hooks/use-toast-app";
import type {
    CommentApiGetCommentsByReferenceRequest,
    CommentApiCreateCommentRequest,
    CommentApiDeleteCommentRequest,
    CommentRequest,
    CommentResponse,
} from "@/api/generated/common/api";

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface CommentSectionProps {
    companyId: string;
    referenceId: string;
    referenceType: string;
    isReadOnly?: boolean;
}

/* ─── Helper: avatar initials ────────────────────────────────────────────── */

function getInitials(name?: string): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/* ─── Helper: format relative time (Vietnamese) ─────────────────────────── */

function formatRelativeTime(dateStr?: string): string {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "Vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString("vi-VN");
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function CommentSection({
    companyId,
    referenceId,
    referenceType,
    isReadOnly = false,
}: CommentSectionProps) {
    const { user } = useAuth();
    const { success, error } = useToastApp();

    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newContent, setNewContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    // ─── Load danh sách bình luận ─────────────────────────────────────────
    const loadComments = useCallback(async () => {
        if (!referenceId || !referenceType) return;

        setIsLoading(true);
        try {
            const request: CommentApiGetCommentsByReferenceRequest = {
                xCompanyId: companyId ?? "",
                referenceType,
                referenceId,
            };
            const response = await commonCommentApi.getCommentsByReference(request);
            const data = response.data?.data ?? [];
            // Sắp xếp mới nhất lên đầu
            setComments([...data].sort((a, b) =>
                new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
            ));
        } catch (err) {
            console.error("Lỗi khi tải bình luận:", err);
            error("Không thể tải danh sách bình luận.");
        } finally {
            setIsLoading(false);
        }
    }, [companyId, referenceId, referenceType, error]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    // ─── Gửi bình luận mới ────────────────────────────────────────────────
    const handleSubmit = async () => {
        const content = newContent.trim();
        if (!content) return;

        setIsSubmitting(true);
        try {
            const commentRequest: CommentRequest = {
                referenceId,
                referenceType,
                content,
            };
            const request: CommentApiCreateCommentRequest = {
                xCompanyId: companyId ?? "",
                xUserId: user?.id ?? "",
                commentRequest,
            };

            const response = await commonCommentApi.createComment(request);
            const newComment = response.data?.data;

            if (newComment) {
                // Backend might not return the resolved authorName/authorId immediately after creation
                const enrichedComment = {
                    ...newComment,
                    authorName: newComment.authorName || user?.name || "Ẩn danh",
                    authorId: newComment.authorId || user?.id,
                };
                setComments((prev) => [enrichedComment, ...prev]);
                success("Đã gửi bình luận.");
            }
            setNewContent("");
        } catch (err) {
            console.error("Lỗi khi gửi bình luận:", err);
            error("Không thể gửi bình luận. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // ─── Xóa bình luận ────────────────────────────────────────────────────
    const handleDelete = async (comment: CommentResponse) => {
        if (!comment.id) return;

        setDeletingIds((prev) => new Set(prev).add(comment.id!));
        try {
            const request: CommentApiDeleteCommentRequest = {
                xCompanyId: companyId ?? "",
                id: comment.id,
            };
            await commonCommentApi.deleteComment(request);
            setComments((prev) => prev.filter((c) => c.id !== comment.id));
            success("Đã xóa bình luận.");
        } catch (err) {
            console.error("Lỗi khi xóa bình luận:", err);
            error("Không thể xóa bình luận. Vui lòng thử lại.");
        } finally {
            setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(comment.id!);
                return next;
            });
        }
    };

    const canDeleteComment = (comment: CommentResponse) =>
        !isReadOnly && (comment.authorId === user?.id);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <CardTitle>Bình luận</CardTitle>
                </div>
                <CardDescription>
                    {isLoading
                        ? "Đang tải..."
                        : `${comments.length} bình luận`}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* ─── Ô nhập bình luận ─── */}
                {!isReadOnly && (
                    <div className="flex flex-col gap-2 w-full">
                        <InputGroup className="w-full focus-within:ring-1 focus-within:ring-ring">
                            <TextareaAutosize
                                data-slot="input-group-control"
                                className="flex field-sizing-content min-h-12 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                                placeholder="Viết bình luận... (Ctrl + Enter để gửi)"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isSubmitting}
                            />
                            <InputGroupAddon align="block-end" className="p-1">
                                <InputGroupButton
                                    className="ml-auto"
                                    size="sm"
                                    variant="default"
                                    disabled={isSubmitting || !newContent.trim()}
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? (
                                        "Đang gửi..."
                                    ) : (
                                        <>
                                            Gửi
                                        </>
                                    )}
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                )}

                {/* ─── Danh sách bình luận ─── */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                    <div className="h-10 bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                        <p className="text-sm">Chưa có bình luận nào</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {comments.map((comment) => {
                            const isDeleting = comment.id ? deletingIds.has(comment.id) : false;
                            const isOwner = canDeleteComment(comment);

                            return (
                                <li
                                    key={comment.id}
                                    className={`flex gap-3 group ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                                >
                                    {/* Avatar */}
                                    {comment.authorAvatar ? (
                                        <img
                                            src={comment.authorAvatar}
                                            alt={comment.authorName}
                                            className="w-8 h-8 rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                                            {getInitials(comment.authorName)}
                                        </div>
                                    )}

                                    {/* Nội dung */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium">
                                                {comment.authorName ?? "Ẩn danh"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatRelativeTime(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm mt-1 text-foreground whitespace-pre-wrap break-words">
                                            {comment.content}
                                        </p>
                                    </div>

                                    {/* Nút xóa (chỉ chủ comment) */}
                                    {isOwner && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            disabled={isDeleting}
                                            onClick={() => handleDelete(comment)}
                                            aria-label="Xóa bình luận"
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
            </CardContent>
        </Card>
    );
}
