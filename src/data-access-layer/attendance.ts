import { get, post } from "@/lib/axios/client";
import type {
	AttendanceAnalyticsDao,
	AttendanceAnalyticsParams,
	AttendanceDao,
	AttendanceHistoryParams,
	CreateAttendanceDto,
	PaginatedResponse,
	QrCheckInDto,
} from "@/lib/types/api";

export const createAttendance = (
	data: CreateAttendanceDto,
): Promise<AttendanceDao> =>
	post<AttendanceDao, CreateAttendanceDto>("/attendance", data);

export const qrCheckIn = (data: QrCheckInDto): Promise<AttendanceDao> =>
	post<AttendanceDao, QrCheckInDto>("/attendance/qr-checkin", data, {
		requiresAuth: false,
	});

export const getAttendanceHistory = (
	params: AttendanceHistoryParams,
): Promise<PaginatedResponse<AttendanceDao>> =>
	get<PaginatedResponse<AttendanceDao>>("/attendance/history", {
		params: {
			start_date: params.start_date,
			end_date: params.end_date,
			page: params.page || 1,
			limit: params.limit || 10,
		},
	});

export const getAttendanceAnalytics = (
	params: AttendanceAnalyticsParams,
): Promise<AttendanceAnalyticsDao> =>
	get<AttendanceAnalyticsDao>("/attendance/analytics", {
		params: {
			date: params.date,
		},
	});
