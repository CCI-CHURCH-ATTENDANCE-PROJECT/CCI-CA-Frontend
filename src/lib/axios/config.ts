import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosResponse,
} from "axios";
import type { ApiError, ApiResponse } from "../types/api";
import { logger } from "../utils/logger";
// import { getSession } from "next-auth/react";

export class ApiException extends Error {
	public readonly statusCode: number;
	public readonly apiError: ApiError;

	constructor(statusCode: number, apiError: ApiError) {
		super(apiError.message);
		this.name = "ApiException";
		this.statusCode = statusCode;
		this.apiError = apiError;
	}
}

const createAxiosInstance = () => {
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
		timeout: 30000,
		headers: {
			"Content-Type": "application/json",
		},
	});

	//Request Interceptors
	instance.interceptors.request.use(
		async (config) => {
			logger.apiRequest(
				config.method?.toUpperCase() || "UNKNOWN",
				config.url || "",
				config.data,
			);

			if (config.params) {
				config.params._t = Date.now();
			} else {
				config.params = { _t: Date.now() };
			}

			return config;
		},
		(error) => {
			logger.apiError("REQUEST_INTERCEPTOR", "N/A", error);
			return Promise.reject(error);
		},
	);

	//Response Interceptors
	instance.interceptors.response.use(
		(response: AxiosResponse<ApiResponse>) => {
			logger.apiResponse(
				response.config.method?.toUpperCase() || "UNKNOWN",
				response.config.url || "",
				response.status,
				response.data,
			);

			if (!response.data.success && response.data.error) {
				throw new ApiException(response.status, response.data.error);
			}

			return response;
		},
		(error: AxiosError<ApiResponse>) => {
			logger.apiError(
				error.config?.method?.toUpperCase() || "UNKNOWN",
				error.config?.url || "",
				error,
			);

			if (error.response) {
				const apiError: ApiError = error.response.data?.error || {
					code: "SERVER_ERROR",
					message: error.message || "An unexpected error occurred",
				};
				throw new ApiException(error.response.status, apiError);
			} else if (error.request) {
				const apiError: ApiError = {
					code: "NETWORK_ERROR",
					message: "Network error. Please check your connection.",
				};
				throw new ApiException(0, apiError);
			} else {
				const apiError: ApiError = {
					code: "UNKNOWN_ERROR",
					message: error.message || "An unexpected error occurred",
				};
				throw new ApiException(0, apiError);
			}
		},
	);

	return instance;
};

export const apiClient = createAxiosInstance();

// Add auth interceptor for client-side requests
apiClient.interceptors.request.use(async (config) => {
	if (
		typeof window !== "undefined" &&
		config.headers &&
		!config.headers.Authorization
	) {
		try {
			const session = await getSession();
			if (session?.accessToken) {
				config.headers.Authorization = `Bearer ${session.accessToken}`;
			}
		} catch (error) {
			logger.warn("Failed to get session for client request", error);
		}
	}
	return config;
});

export const apiServer = createAxiosInstance();

// Add auth interceptor for server-side requests
apiServer.interceptors.request.use(async (config) => {
	if (
		typeof window === "undefined" &&
		config.headers &&
		!config.headers.Authorization
	) {
		try {
			const session = await auth();
			if (session?.accessToken) {
				config.headers.Authorization = `Bearer ${session.accessToken}`;
			}
		} catch (error) {
			logger.warn("Failed to get session for server request", error);
		}
	}
	return config;
});

export const getApiInstance = (): AxiosInstance => {
	return typeof window === "undefined" ? apiServer : apiClient;
};

//Dummy session functions for axios interceptors. This will be migrated to the actual Next-Auth functions once it is set up
const getSession = async () => {
	return {
		accessToken: "some-dummy-token",
	};
};

const auth = async () => {
	return {
		accessToken: "some-dummy-token",
	};
};
