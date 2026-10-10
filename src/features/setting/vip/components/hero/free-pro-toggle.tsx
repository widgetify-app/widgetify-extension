import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

interface FreeProToggleProps {
	isPro: boolean
	onChoose: (isPro: boolean) => void
}

const OPTION_CLASS =
	'relative z-10 h-10 w-28 rounded-full text-sm font-extrabold cursor-pointer transition-ui duration-300 focus-visible:focus-ring'

export function FreeProToggle({ isPro, onChoose }: FreeProToggleProps) {
	return (
		<fieldset
			aria-label={t('setting.vip.compareLabel')}
			className="relative inline-flex p-1 border rounded-full bg-surface border-line shadow-md"
		>
			<span
				aria-hidden="true"
				className={cn(
					'absolute top-1 right-1 h-10 w-28 rounded-full transition-ui duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]',
					isPro
						? '-translate-x-full bg-vip shadow-[0_8px_18px_-8px_var(--color-vip)]'
						: 'bg-fill-2'
				)}
			/>
			<button
				type="button"
				aria-pressed={!isPro}
				onClick={() => onChoose(false)}
				className={cn(OPTION_CLASS, isPro ? 'text-fg-muted' : 'text-fg-strong')}
			>
				{t('setting.vip.freeLabel')}
			</button>
			<button
				type="button"
				aria-pressed={isPro}
				onClick={() => onChoose(true)}
				className={cn(
					OPTION_CLASS,
					'inline-flex items-center justify-center gap-1.5',
					isPro ? 'text-on-vip' : 'text-vip'
				)}
			>
				{!isPro && (
					<span
						aria-hidden="true"
						className="absolute inset-0 border-2 rounded-full opacity-0 border-vip animate-pro-ping"
					/>
				)}
				<Icon name="diamond" size={16} />
				{t('setting.vip.proLabel')}
			</button>
		</fieldset>
	)
}
