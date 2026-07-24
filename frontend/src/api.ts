const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export type AircraftType = "ATR" | "Airbus 320" | "Boeing 737 Max";

export interface CheckVoucherPayload {
  flightNumber: string;
  date: string;
}

export interface CheckVoucherResponse {
  exists: boolean;
}

export interface GenerateVoucherPayload {
  name: string;
  id: string;
  flightNumber: string;
  date: string;
  aircraft: AircraftType;
}

export interface GenerateVoucherResponse {
  success: boolean;
  seats: string[];
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function toIsoDate(ddmmyyyy: string): string {
  const [day, month, year] = ddmmyyyy.split("-");
  return `${year}-${month}-${day}`;
}

async function request<TResponse>(
  path: string,
  body: unknown,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data: ApiErrorResponse & Partial<TResponse> = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message ?? "Request failed",
      response.status,
      data.errors,
    );
  }

  return data as TResponse;
}

export function checkVoucher(
  payload: CheckVoucherPayload,
): Promise<CheckVoucherResponse> {
  return request<CheckVoucherResponse>("/check", payload);
}

export function generateVoucher(
  payload: GenerateVoucherPayload,
): Promise<GenerateVoucherResponse> {
  return request<GenerateVoucherResponse>("/generate", payload);
}
