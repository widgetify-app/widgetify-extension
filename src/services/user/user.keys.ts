export const userKeys = {
	profile: ['userProfile'] as const,
	sendVerificationEmail: ['sendVerificationEmail'] as const,
	referrals: (page?: number, limit?: number) => ['referrals', page, limit] as const,
	referralCode: ['getOrCreateReferralCode'] as const,
}
