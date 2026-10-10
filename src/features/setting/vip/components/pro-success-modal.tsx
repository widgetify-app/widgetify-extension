import { useEffect } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { playNativeToastSound } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Button, Modal } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import { STILL_LOOPS_CLASS } from '../constants'
import { formatNumber } from '../utils/format'
import { Mascot } from './mascot'

const UNLOCKED: MessageKey[] = [
	'setting.vip.unlockLayout',
	'setting.vip.sizesTitle',
	'setting.vip.videoShort',
	'setting.vip.unlockGallery',
]

const CONFETTI_TONES = ['bg-vip', 'bg-warning', 'bg-danger', 'bg-success', 'bg-info']

function seededConfetti() {
	let seed = 7
	const next = () => {
		seed = (seed * 9301 + 49297) % 233280
		return seed / 233280
	}
	return Array.from({ length: 26 }, (_, index) => {
		const isRound = next() > 0.7
		const width = isRound ? 8 : 6 + Math.round(next() * 4)
		return {
			isRound,
			tone: CONFETTI_TONES[index % CONFETTI_TONES.length],
			fall: index % 2 ? 'animate-pro-confetti-left' : 'animate-pro-confetti-right',
			style: {
				left: `${Math.round(4 + next() * 92)}%`,
				width,
				height: isRound ? 8 : 10 + Math.round(next() * 5),
				animationDuration: `${(2.6 + next() * 1.6).toFixed(2)}s`,
				animationDelay: `${(next() * 2.4).toFixed(2)}s`,
			},
		}
	})
}

const CONFETTI = seededConfetti()

interface ProSuccessModalProps {
	isOpen: boolean
	onClose: () => void
	days: number
}

export function ProSuccessModal({ isOpen, onClose, days }: ProSuccessModalProps) {
	const { isOptimalMode } = useGeneralSetting()

	useEffect(() => {
		if (isOpen) playNativeToastSound('success')
	}, [isOpen])

	const arrange = () => {
		onClose()
		callEvent('openAddCustomWidgetModal', { returnToSettings: true })
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			closeOnBackdropClick
			closeLabel={t('ui.common.close')}
		>
			<div
				className={cn(
					'flex flex-col items-center text-center select-none',
					isOptimalMode && STILL_LOOPS_CLASS
				)}
			>
				<div
					aria-hidden="true"
					className="relative w-full overflow-hidden h-52 rounded-2xl bg-vip-fill"
				>
					<div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle,var(--color-vip-fill-2)_1.1px,transparent_1.5px)] bg-size-[20px_20px]" />
					<svg
						aria-hidden="true"
						viewBox="0 0 400 208"
						className="absolute inset-0 size-full"
					>
						<circle
							cx="200"
							cy="120"
							r="80"
							fill="none"
							strokeWidth="2"
							className="[transform-box:fill-box] origin-center stroke-vip-fill-2 animate-pro-burst"
						/>
						<circle
							cx="200"
							cy="120"
							r="80"
							fill="none"
							strokeWidth="2"
							className="[transform-box:fill-box] origin-center stroke-warning [animation-delay:1.4s] animate-pro-burst"
						/>
					</svg>
					{CONFETTI.map((bit, index) => (
						<span
							key={index}
							style={bit.style}
							className={cn(
								'absolute top-0 opacity-0',
								bit.isRound ? 'rounded-full' : 'rounded-xs',
								bit.tone,
								bit.fall
							)}
						/>
					))}
					<Mascot
						pose="cheer"
						className="absolute w-36 -bottom-1.5 left-1/2 -translate-x-1/2"
					/>
				</div>

				<h3 className="mt-5 text-2xl font-black text-fg-strong animate-pro-rise">
					{t('setting.vip.successLead')}{' '}
					<span className="text-vip">{t('setting.vip.proLabel')}</span>
					{t('setting.vip.successTail')}
				</h3>
				<p className="max-w-sm mt-1.5 text-sm font-medium leading-loose text-fg-muted animate-pro-rise [animation-delay:100ms]">
					{t('setting.vip.successBody', { days: formatNumber(days) })}
				</p>

				<ul className="grid w-full grid-cols-2 gap-2 mt-4.5">
					{UNLOCKED.map((key, index) => (
						<li
							key={key}
							style={{ animationDelay: `${350 + index * 150}ms` }}
							className="flex items-center gap-2 px-3 text-xs font-bold border h-10.5 rounded-xl text-start bg-vip-fill border-vip-fill-2 text-fg animate-pro-pop"
						>
							<span className="grid rounded-full shrink-0 size-5.5 place-items-center bg-vip text-on-vip">
								<Icon name="check" size={12} strokeWidth={3} />
							</span>
							{t(key)}
						</li>
					))}
				</ul>

				<Button
					color="vip"
					size="lg"
					rounded="2xl"
					fullWidth
					onClick={arrange}
					className="mt-5.5 gap-2.5 text-base font-black h-13 hover:-translate-y-0.5 shadow-[0_12px_26px_-12px_var(--color-vip)]"
				>
					{t('setting.vip.successArrange')}
					<Icon name="arrowLeft" size={20} />
				</Button>
				<Button variant="ghost" className="mt-2 font-bold" onClick={onClose}>
					{t('setting.vip.later')}
				</Button>
			</div>
		</Modal>
	)
}
