import { post } from "@/lib/axios/client";
import type {
	AuthResponseDao,
	BasicRegisterDto,
	CompleteRegisterDto,
	LoginDto,
	RefreshTokenDto,
} from "@/lib/types/api";

/**
 * Basic user registration (first step)
 */
export const register = (data: BasicRegisterDto): Promise<AuthResponseDao> =>
	post<AuthResponseDao, BasicRegisterDto>("/auth/register", data, {
		requiresAuth: false,
	});

/**
 * Complete user registration (second step with full details)
 */
export const completeRegistration = (
	data: CompleteRegisterDto,
): Promise<AuthResponseDao> =>
	post<AuthResponseDao, CompleteRegisterDto>("/auth/register/complete", data, {
		requiresAuth: false,
	});

/**
 * User login
 */
export const login = (data: LoginDto): Promise<AuthResponseDao> =>
	post<AuthResponseDao, LoginDto>("/auth/login", data, { requiresAuth: false });

/**
 * Refresh access token
 */
export const refreshToken = (data: RefreshTokenDto): Promise<AuthResponseDao> =>
	post<AuthResponseDao, RefreshTokenDto>("/auth/refresh", data, {
		requiresAuth: false,
	});

/**
 * Logout user
 */
export const logout = (): Promise<void> => post<void>("/auth/logout");
