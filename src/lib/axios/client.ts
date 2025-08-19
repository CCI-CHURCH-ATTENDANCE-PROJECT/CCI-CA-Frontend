import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
	ApiRequestConfig,
	ApiResponse,
	HttpMethod,
} from "@/lib/types/api";
import { logger } from "@/lib/utils/logger";
import { ApiException, getApiInstance } from "./config";

async function makeRequest<TResponse = unknown, _TRequest = unknown>(
	method: HttpMethod,
	url: string,
	config: ApiRequestConfig = {},
	instance?: AxiosInstance,
): Promise<TResponse> {
	try {
		const apiInstance = instance || getApiInstance();
		const { requiresAuth = true, params, data, headers = {} } = config;

		const axiosConfig: AxiosRequestConfig = {
			method,
			url,
			params,
			data,
			headers: {
				...headers,
			},
		};

		if (!requiresAuth) {
			axiosConfig.headers = {
				...axiosConfig.headers,
				"X-Skip-Auth": "true",
			};
		}

		const response =
			await apiInstance.request<ApiResponse<TResponse>>(axiosConfig);

		return response.data.data as TResponse;
	} catch (error) {
		if (error instanceof ApiException) {
			throw error;
		}

		logger.error(`API request failed: ${method} ${url}`, error);
		throw error;
	}
}

export const get = <TResponse = unknown>(
	url: string,
	config: Omit<ApiRequestConfig, "data"> = {},
	instance?: AxiosInstance,
): Promise<TResponse> => makeRequest<TResponse>("GET", url, config, instance);

export const post = <TResponse = unknown, TRequest = unknown>(
	url: string,
	data?: TRequest,
	config: Omit<ApiRequestConfig, "data"> = {},
	instance?: AxiosInstance,
): Promise<TResponse> =>
	makeRequest<TResponse, TRequest>("POST", url, { ...config, data }, instance);

export const put = <TResponse = unknown, TRequest = unknown>(
	url: string,
	data?: TRequest,
	config: Omit<ApiRequestConfig, "data"> = {},
	instance?: AxiosInstance,
): Promise<TResponse> =>
	makeRequest<TResponse, TRequest>("PUT", url, { ...config, data }, instance);

export const patch = <TResponse = unknown, TRequest = unknown>(
	url: string,
	data?: TRequest,
	config: Omit<ApiRequestConfig, "data"> = {},
	instance?: AxiosInstance,
): Promise<TResponse> =>
	makeRequest<TResponse, TRequest>("PATCH", url, { ...config, data }, instance);

export const del = <TResponse = unknown>(
	url: string,
	config: Omit<ApiRequestConfig, "data"> = {},
	instance?: AxiosInstance,
): Promise<TResponse> =>
	makeRequest<TResponse>("DELETE", url, config, instance);

export const withToken = (token: string): AxiosInstance => {
	const instance = getApiInstance();
	instance.defaults.headers.Authorization = `Bearer ${token}`;
	return instance;
};

export const api = getApiInstance();
export const publicApi = getApiInstance();

export const handleApiError = (error: unknown): string => {
	if (error instanceof ApiException) {
		if (error.apiError.details && error.apiError.details.length > 0) {
			const fieldErrors = error.apiError.details
				.map((detail) => `${detail.field}: ${detail.message}`)
				.join(", ");
			return `${error.apiError.message}. ${fieldErrors}`;
		}
		return error.apiError.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "An unexpected error occurred";
};

export const isApiError = (error: unknown, code: string): boolean => {
	return error instanceof ApiException && error.apiError.code === code;
};

export const isValidationError = (error: unknown): boolean => {
	return error instanceof ApiException && error.statusCode === 422;
};

export const isAuthError = (error: unknown): boolean => {
	return (
		error instanceof ApiException &&
		(error.statusCode === 401 || error.statusCode === 403)
	);
};
