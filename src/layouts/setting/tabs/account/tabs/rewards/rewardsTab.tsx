import { FiInfo } from 'react-icons/fi'
import { ConfigKey } from '@/common/constant/config.key'
import { SectionPanel } from '@/components/section-panel'
import { useGetReferrals } from '@/services/hooks/user/referralsService.hook'
import { ReferralCodeSection } from './components/ReferralCodeSection'
import { RewardTasks } from './components/tasks'
import { RequireVerification } from '@/components/auth/require-verification'
import { useAuth } from '@/context/auth.context'

export const RewardsTab = () => {
	const { user } = useAuth()
	const { data, isLoading } = useGetReferrals({
		enabled: user?.phone !== null || (user?.email !== null && user?.verified),
	})

	const code = data?.code || ''
	const tasks = data?.tasks || []

	return (
		<div className="space-y-2">
			<RequireVerification mode="preview">
				<SectionPanel
					title={
						<div className="flex items-center gap-2">
							<div className="flex items-center justify-center">
								<img
									src={ConfigKey.WIG_COIN_ICON}
									alt="ویج‌کوین"
									className="object-center w-8 h-8"
								/>
							</div>
							<span>ویج‌کوین چیست؟</span>
						</div>
					}
					size="xs"
				>
					<div className="p-2 border rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
						<div className="flex items-start gap-3">
							<FiInfo className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
							<div className="flex-1">
								<p className="mb-2 text-sm font-medium text-content">
									ویج‌کوین، سکه ویژه ویجتیفای است که می‌توانید آن را
									جمع‌آوری و خرج کنید! 🎉
								</p>
								<p className="text-xs text-muted">
									با جمع‌آوری ویج‌کوین می‌توانید آن‌ها را خرج کنید و محصولات
									و امکانات ویژه داخل ویجتیفای را بخرید.
								</p>
							</div>
						</div>
					</div>
				</SectionPanel>

				<ReferralCodeSection code={code} />
				<RewardTasks tasks={tasks} isLoading={isLoading} />
			</RequireVerification>
		</div>
	)
}
