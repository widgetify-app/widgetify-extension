import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/button/button'
import { useAuth } from '@/context/auth.context'
import type { MiniAppScopeEnum } from '@/services/hooks/mini-apps/mini-apps-interface'
import { CiCircleAlert } from 'react-icons/ci'

interface Prop {
	scopes: MiniAppScopeEnum[]
	onConfirm: any
}

let SCOPES_LABEL: Record<MiniAppScopeEnum, string> = {
	ACCOUNT: 'شماره همراه و ایمیل',
	PROFILE: 'اطلاعات پروفایل (نام، نام کاربری، تصویر پروفایل)',
}

export function WebAppAuthGate({ scopes, onConfirm }: Prop) {
	const { isAuthenticated } = useAuth()
	const onClick = () => {
		onConfirm()
		Analytics.event('web_app_permission_gate_clicked')
	}

	return (
		<div className="absolute inset-0 flex items-center justify-center p-6">
			<div className="flex flex-col items-center w-full max-w-sm gap-6 p-6 text-center rounded-2xl bg-background">
				<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-warning/10">
					<span className="text-2xl text-warning">
						<CiCircleAlert />
					</span>
				</div>

				{isAuthenticated ? (
					<>
						<div className="flex flex-col items-center gap-3">
							<p className="text-sm font-semibold">نیاز به تایید دسترسی</p>
							<p className="max-w-xs text-xs leading-relaxed opacity-70">
								این برنامک برای ادامه نیاز داره به اطلاعات زیر دسترسی
								داشته باشه:
							</p>

							<ul className="flex flex-col w-full max-w-xs gap-2 text-xs">
								{scopes.map((s) => (
									<li
										key={s}
										className="px-3 py-2 rounded-lg bg-base-content/2 text-base-content/80"
									>
										{SCOPES_LABEL[s] || s}
									</li>
								))}
							</ul>
						</div>

						<Button
							type="button"
							onClick={onClick}
							size="sm"
							rounded="xl"
							isPrimary
							className="w-full text-sm font-medium border-none"
						>
							تایید و ادامه
						</Button>
					</>
				) : (
					<>
						<div className="flex flex-col items-center gap-3">
							<p className="text-sm font-semibold">
								نیازمند ورود به حساب کاربری
							</p>
							<p className="max-w-xs text-xs leading-relaxed opacity-70">
								برای ورود به برنامک، باید وارد حساب کاربری شوید
							</p>
						</div>

						<Button
							type="button"
							onClick={() => callEvent('openProfile')}
							size="sm"
							rounded="xl"
							isPrimary
							className="w-full text-sm font-medium border-none"
						>
							باشه، ورود به حساب
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
