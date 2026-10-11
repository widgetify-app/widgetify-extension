export type LaunchFailure =
	| 'NOT_SIGNED_IN'
	| 'CONSENT_REQUIRED'
	| 'PHONE_REQUIRED'
	| 'EMAIL_REQUIRED'
	| 'EMAIL_OR_PHONE_REQUIRED'
	| 'WIDGET_NOT_FOUND'
	| 'UNAVAILABLE'
	| 'FAILED'

const CODES: LaunchFailure[] = [
	'CONSENT_REQUIRED',
	'PHONE_REQUIRED',
	'EMAIL_REQUIRED',
	'EMAIL_OR_PHONE_REQUIRED',
	'WIDGET_NOT_FOUND',
]

export function launchFailureOf(error: unknown): LaunchFailure {
	const response = (
		error as {
			response?: { status?: unknown; data?: { message?: unknown } }
		} | null
	)?.response

	if (!response) return 'UNAVAILABLE'

	if (response.status === 401) return 'NOT_SIGNED_IN'

	const message = response.data?.message
	const code = CODES.find((candidate) => candidate === message)

	if (code) return code

	if (response.status === 404) return 'WIDGET_NOT_FOUND'
	if (response.status === 503) return 'UNAVAILABLE'

	return 'FAILED'
}
