/**
 * Utility functions for consistent error handling across the application
 */

export interface ErrorInfo {
	message: string
	source: string
	timestamp: Date
	userAgent?: string
}

/**
 * Creates a standardized error object with additional context
 */
export function createErrorInfo(error: unknown, source: string): ErrorInfo {
	return {
		message: error instanceof Error ? error.message : 'Unknown error occurred',
		source,
		timestamp: new Date(),
		userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
	}
}

/**
 * Logs error information in a consistent format
 */
export function logError(error: unknown, source: string): void {
	const errorInfo = createErrorInfo(error, source)
	
	if (import.meta.env.DEV) {
		console.error(`[${source}]`, errorInfo)
	}
	
	// In production, you might want to send this to an error reporting service
	// Example: errorReportingService.captureException(errorInfo)
}

/**
 * Creates a user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
	if (error instanceof Error) {
		// Handle common error patterns
		if (error.message.includes('Network Error')) {
			return 'اتصال به اینترنت برقرار نیست. لطفاً اتصال خود را بررسی کنید.'
		}
		if (error.message.includes('401')) {
			return 'احراز هویت شما منقضی شده است. لطفاً دوباره وارد شوید.'
		}
		if (error.message.includes('403')) {
			return 'شما دسترسی لازم برای این عملیات را ندارید.'
		}
		if (error.message.includes('404')) {
			return 'منبع مورد نظر یافت نشد.'
		}
		if (error.message.includes('500')) {
			return 'خطای سرور. لطفاً بعداً تلاش کنید.'
		}
	}
	
	return 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.'
}
