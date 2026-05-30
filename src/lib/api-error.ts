import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

type ApiErrorPayload = {
  status?: number;
  message?: string;
  data?: {
    code?: string;
    traceId?: string;
    timestamp?: string;
    path?: string;
    method?: string;
    details?: unknown;
  } | unknown;
};

export type NormalizedApiError = Error & {
  status?: number;
  code?: string;
  traceId?: string;
  timestamp?: string;
  path?: string;
  method?: string;
  details?: unknown;
  response?: AxiosResponse;
  requestConfig?: InternalAxiosRequestConfig;
  original?: unknown;
};

export type ApiForbiddenEventDetail = {
  message: string;
  traceId?: string;
  code?: string;
};

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (isNormalizedApiError(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return normalizeAxiosError(error);
  }

  if (isApiResponsePayload(error)) {
    return buildError(error.message || "Yêu cầu không thành công", {
      status: error.status,
      code: getDataField(error.data, "code"),
      traceId: getDataField(error.data, "traceId"),
      timestamp: getDataField(error.data, "timestamp"),
      path: getDataField(error.data, "path"),
      method: getDataField(error.data, "method"),
      details: getDataField(error.data, "details"),
      original: error,
    });
  }

  if (error instanceof Error) {
    return buildError(error.message, { original: error });
  }

  return buildError("Lỗi không xác định", { original: error });
}

export function getApiErrorMessage(error: unknown, fallback = "Lỗi kết nối tới máy chủ."): string {
  return normalizeApiError(error).message || fallback;
}

export function getApiErrorTraceId(error: unknown): string | undefined {
  return normalizeApiError(error).traceId;
}

export function formatApiErrorForUser(error: unknown, fallback = "Yêu cầu không thành công."): string {
  const normalized = normalizeApiError(error);
  const message = normalized.message || fallback;
  return normalized.traceId ? `${message} (Trace ID: ${normalized.traceId})` : message;
}

export function isApiForbidden(error: unknown): boolean {
  return normalizeApiError(error).status === 403;
}

export function logApiError(context: string, error: unknown) {
  const normalized = normalizeApiError(error);
  const logPayload = {
    status: normalized.status,
    code: normalized.code,
    message: normalized.message,
    traceId: normalized.traceId,
    method: normalized.method || normalized.requestConfig?.method?.toUpperCase(),
    path: normalized.path || normalized.requestConfig?.url,
    details: normalized.details,
  };

  if ((normalized.status ?? 0) >= 500 || !normalized.status) {
    console.error(context, logPayload, normalized.original || normalized);
    return;
  }

  console.warn(context, logPayload);
}

function normalizeAxiosError(error: AxiosError<ApiErrorPayload>): NormalizedApiError {
  const response = error.response;
  const payload = response?.data;
  const payloadData = payload?.data;
  const responseTraceId = response?.headers?.["x-trace-id"] as string | undefined;

  return buildError(payload?.message || error.message || "Yêu cầu không thành công", {
    status: payload?.status || response?.status,
    code: getDataField(payloadData, "code"),
    traceId: getDataField(payloadData, "traceId") || responseTraceId,
    timestamp: getDataField(payloadData, "timestamp"),
    path: getDataField(payloadData, "path") || error.config?.url,
    method: getDataField(payloadData, "method") || error.config?.method?.toUpperCase(),
    details: getDataField(payloadData, "details"),
    response,
    requestConfig: error.config,
    original: error,
  });
}

function buildError(
  message: string,
  fields: Omit<NormalizedApiError, "name" | "message">
): NormalizedApiError {
  const normalized = new Error(message) as NormalizedApiError;
  normalized.name = "ApiError";
  Object.assign(normalized, fields);
  return normalized;
}

function isNormalizedApiError(error: unknown): error is NormalizedApiError {
  return error instanceof Error && error.name === "ApiError";
}

function isApiResponsePayload(error: unknown): error is ApiErrorPayload {
  return Boolean(error && typeof error === "object" && "status" in error && "message" in error);
}

function getDataField(data: unknown, field: string): string | undefined;
function getDataField(data: unknown, field: "details"): unknown;
function getDataField(data: unknown, field: string): unknown {
  if (!data || typeof data !== "object" || !(field in data)) {
    return undefined;
  }
  return (data as Record<string, unknown>)[field];
}
