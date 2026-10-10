import { type MessageKey, t } from '@/common/i18n'
import { Icon, type IconName } from '@/icons'

const PROMISES: { icon: IconName; text: MessageKey }[] = [
	{ icon: 'verifyUser', text: 'setting.vip.trustPayment' },
	{ icon: 'zap', text: 'setting.vip.trustInstant' },
	{ icon: 'userCheck', text: 'setting.vip.trustAccount' },
]

export function TrustRow() {
	return (
		<ul className="flex flex-wrap justify-center text-xs font-semibold gap-x-6 gap-y-2 text-fg-muted">
			{PROMISES.map((promise) => (
				<li key={promise.text} className="inline-flex items-center gap-1.5">
					<Icon name={promise.icon} size={16} />
					{t(promise.text)}
				</li>
			))}
		</ul>
	)
}
