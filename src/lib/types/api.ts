//Utility Types
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// HTTP Methods
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Request Configuration
export interface ApiRequestConfig {
	requiresAuth?: boolean;
	params?: Record<string, unknown>;
	data?: unknown;
	headers?: Record<string, string>;
}

//Base API Response Types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: ApiError;
}

export interface ApiError {
	code: string;
	message: string;
	details?: Array<{
		field: string;
		message: string;
	}>;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

//Auth DTOs
export interface BasicRegisterDto {
	email: string;
	password: string;
}

export interface CompleteRegisterDto {
	email: string;
	password: string;
	fname: string;
	lname: string;
	bio: string;
	date_of_birth: string;
	gender: string;
	member: boolean;
	visitor: boolean;
	phone_number: string;
	profession: string;
	user_house_address: string;
	campus_state: string;
	campus_country: string;
	emergency_contact_name: string;
	emergency_contact_phone: string;
	emergency_contact_email: string;
	emergency_contact_relationship: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface RefreshTokenDto {
	refresh_token: string;
}

//Auth Response DAOs
export interface AuthResponseDao {
	access_token: string;
	refresh_token: string;
	user: UserDao;
	expires_in: number;
}

export type UserDao = Expand<CompleteRegisterDto>;

export interface SearchUserParams {
	q: string;
	page?: number;
	limit?: number;
}

export interface GetUserParams {
	page?: number;
	limit?: number;
}

export interface FilterUserParams {
	field: string;
	value: string;
	page?: number;
	limit?: number;
}

//Attendance DTOs
export interface CreateAttendanceDto {
	user_id: string;
}

export interface QrCheckInDto {
	qr_code_token: string;
}

export interface AttendanceHistoryParams {
	start_date: string;
	end_date: string;
	page?: number;
	limit?: number;
}

export interface AttendanceAnalyticsParams {
	date: string;
}

// Attendance Response DAOs
export interface AttendanceDao {
	id: string;
	user_id: string;
	user: UserDao;
	checked_in_at: string;
	created_at: string;
	updated_at: string;
}

export interface AttendanceAnalyticsDao {
	date: string;
	total_attendees: number;
	members_count: number;
	visitors_count: number;
	hourly_breakdown: Array<{
		hour: number;
		count: number;
	}>;
}

// QR Code DTOs
export interface GenerateQrDto {
	user_id: string;
}

export interface QrCodeDao {
	qr_code: string;
	token: string;
	expires_at: string;
}
