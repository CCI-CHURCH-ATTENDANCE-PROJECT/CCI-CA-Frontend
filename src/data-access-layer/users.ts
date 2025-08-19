import { get } from "@/lib/axios/client";
import type {
	FilterUserParams,
	GetUserParams,
	PaginatedResponse,
	SearchUserParams,
	UserDao,
} from "@/lib/types/api";

export const searchUsers = (
	params: SearchUserParams,
): Promise<PaginatedResponse<UserDao>> =>
	get<PaginatedResponse<UserDao>>("/users/search", {
		params: {
			q: params.q,
			page: params.page || 1,
			limit: params.limit || 10,
		},
	});

export const getAllUsers = (
	params: GetUserParams = {},
): Promise<PaginatedResponse<UserDao>> =>
	get<PaginatedResponse<UserDao>>("/users", {
		params: {
			page: params.page || 1,
			limit: params.limit || 10,
		},
	});

export const filterUsers = (
	params: FilterUserParams,
): Promise<PaginatedResponse<UserDao>> =>
	get<PaginatedResponse<UserDao>>("/users/filter", {
		params: {
			field: params.field,
			value: params.value,
			page: params.page || 1,
			limit: params.limit || 10,
		},
	});
