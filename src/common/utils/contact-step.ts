export type ContactStep = 'phone' | 'email'

export function contactStepOfError(error: unknown): ContactStep | null {
	const message = (error as { response?: { data?: { message?: unknown } } } | null)
		?.response?.data?.message

	if (message === 'PHONE_REQUIRED' || message === 'EMAIL_OR_PHONE_REQUIRED') {
		return 'phone'
	}

	return message === 'EMAIL_REQUIRED' ? 'email' : null
}
