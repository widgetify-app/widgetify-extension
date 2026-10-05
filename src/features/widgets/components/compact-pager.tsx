import { Icon, type IconName } from '@/icons'

interface CompactPagerProps {
	previousLabel: string
	nextLabel: string
	onPrevious: () => void
	onNext: () => void
	isPreviousDisabled: boolean
	isNextDisabled: boolean
}

export function CompactPager({
	previousLabel,
	nextLabel,
	onPrevious,
	onNext,
	isPreviousDisabled,
	isNextDisabled,
}: CompactPagerProps) {
	return (
		<span className="flex flex-col flex-none">
			<PagerButton
				icon="chevronUp"
				label={previousLabel}
				onClick={onPrevious}
				disabled={isPreviousDisabled}
			/>
			<PagerButton
				icon="chevronDown"
				label={nextLabel}
				onClick={onNext}
				disabled={isNextDisabled}
			/>
		</span>
	)
}

interface PagerButtonProps {
	icon: IconName
	label: string
	onClick: () => void
	disabled: boolean
}

function PagerButton({ icon, label, onClick, disabled }: PagerButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			className="grid rounded-lg cursor-pointer place-items-center size-5 text-fg-muted transition-ui hover:bg-fill-2 hover:text-fg-strong focus-visible:focus-ring disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
		>
			<Icon name={icon} size={14} aria-hidden="true" />
		</button>
	)
}
