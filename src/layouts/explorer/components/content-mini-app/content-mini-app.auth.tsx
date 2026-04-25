import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/button/button'
import { CiCircleAlert } from 'react-icons/ci'

export function WebAppAuthGate() {
	const onClick = () => {
		callEvent('openProfile')
		Analytics.event('web_app_auth_gate_login_clicked')
	}
	return (
		<div className="absolute inset-0 flex items-center justify-center p-6">
			<div className="flex flex-col items-center w-full max-w-md gap-5 p-5 text-center border shadow-xs rounded-2xl bg-base-100 border-base-300">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-warning/10">
					<span className="text-lg text-warning">
						<CiCircleAlert />
					</span>
				</div>

				<div className="flex flex-col items-center gap-2">
					<p className="text-sm font-semibold">نیاز به ورود</p>
					<p className="max-w-xs text-xs leading-relaxed opacity-60">
						برای استفاده از این برنامه باید وارد حساب کاربری شوید
					</p>
				</div>

				<Button
					onClick={onClick}
					size="sm"
					isPrimary
					rounded="xl"
					className="w-full text-sm border-none"
				>
					ورود و ادامه
				</Button>
			</div>
		</div>
	)
}
