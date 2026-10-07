import { useGetReferrals } from '@/services/user/referrals-service.hook'
import { ReferralCodeSection } from '../components/referral-code-section'
import { RewardTasks } from './components/tasks'
import { RequireVerification } from './components/require-verification'
import { useAuth } from '@/context/auth.context'

export const RewardsTab = () => {
	const { user } = useAuth()
	const { data, isLoading } = useGetReferrals({
		enabled: user?.phone !== null || (user?.email !== null && user?.verified),
	})

	const code = data?.code || ''
	const tasks = data?.tasks || []

	return (
		<div className="flex flex-col h-full gap-4">
			<RequireVerification mode="preview">
				<ReferralCodeSection code={code} />
				<RewardTasks tasks={tasks} isLoading={isLoading} />
			</RequireVerification>
		</div>
	)
}
