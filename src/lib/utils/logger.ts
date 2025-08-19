enum LogLevel {
	ERROR = 0,
	WARN = 1,
	INFO = 2,
	DEBUG = 3,
}

interface LogEntry {
	level: keyof typeof LogLevel;
	message: string;
	data?: unknown;
	timestamp: string;
	source?: string;
}

class Logger {
	private static instance: Logger;
	private logLevel: LogLevel;

	private constructor() {
		this.logLevel =
			process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO;
	}

	public static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	private log(
		level: keyof typeof LogLevel,
		message: string,
		data?: unknown,
		source?: string,
	) {
		if (LogLevel[level] > this.logLevel) return;

		const logEntry: LogEntry = {
			level,
			message,
			data,
			timestamp: new Date().toISOString(),
			source,
		};

		const formattedMessage = `[${logEntry.timestamp}] [${logEntry.level}]${
			source ? ` [${source}]` : ""
		}: ${message}`;

		switch (level) {
			case "ERROR":
				console.error(formattedMessage, data ?? "");
				break;

			case "WARN":
				console.warn(formattedMessage, data ?? "");
				break;

			case "INFO":
				console.info(formattedMessage, data ?? "");
				break;

			case "DEBUG":
				console.debug(formattedMessage, data ?? "");
				break;
		}

		if (process.env.NODE_ENV === "production" && level === "ERROR") {
			//Todo: Send error logs to logging service (Sentry, Grafana or LogRocket)
		}
	}

	public error(message: string, data?: unknown, source?: string) {
		this.log("ERROR", message, data, source);
	}

	public warn(message: string, data?: unknown, source?: string) {
		this.log("WARN", message, data, source);
	}

	public info(message: string, data?: unknown, source?: string) {
		this.log("INFO", message, data, source);
	}

	public debug(message: string, data?: unknown, source?: string) {
		this.log("DEBUG", message, data, source);
	}

	//API Logging
	public apiRequest(method: string, url: string, data?: unknown) {
		this.debug(`Api Request: ${method} ${url}`, data, "API");
	}

	public apiResponse(
		method: string,
		url: string,
		status: number,
		data?: unknown,
	) {
		this.debug(`API Response: ${method} ${url} - ${status}`, data, "API");
	}

	public apiError(method: string, url: string, error: unknown) {
		this.error(`API Error: ${method} ${url}`, error, "API");
	}
}

export const logger = Logger.getInstance();
