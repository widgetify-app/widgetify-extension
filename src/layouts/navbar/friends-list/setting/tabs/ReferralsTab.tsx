import { useGetReferrals } from '@/services/hooks/user/referralsService.hook'
import { ReferralCodeSection } from './components/ReferralCodeSection'
import { ReferralsList } from './components/ReferralsList'

export const ReferralsTab = () => {
	const { data: referralsData, isLoading, error } = useGetReferrals()

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse">
					<div className="h-32 bg-base-200 rounded-xl mb-6"></div>
					<div className="h-64 bg-base-200 rounded-xl"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-content mb-2">خطا در بارگذاری داده‌ها</p>
				<p className="text-sm text-muted">لطفاً دوباره تلاش کنید</p>
			</div>
		)
	}

	const code = referralsData?.code || ''
	const referrals = referralsData?.referrals || []

	return (
		<div className="space-y-6">
			<ReferralCodeSection code={code} />
			<ReferralsList referrals={referrals} />
		</div>
	)
}
