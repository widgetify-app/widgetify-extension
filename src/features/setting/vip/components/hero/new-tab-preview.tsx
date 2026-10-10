import { useRef } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { useContainerSize } from '@/hooks/use-container-size'
import { Icon } from '@/icons'
import { FreeNewTab } from './free-new-tab'
import { ProNewTab } from './pro-new-tab'

const SCENE_WIDTH = 870

interface NewTabPreviewProps {
	isPro: boolean
	isWiping: boolean
	onHoverChange: (isHovered: boolean) => void
}

export function NewTabPreview({ isPro, isWiping, onHoverChange }: NewTabPreviewProps) {
	const sceneRef = useRef<HTMLDivElement>(null)
	const { width } = useContainerSize(sceneRef)
	const now = new Date()

	return (
		<div
			aria-hidden="true"
			onMouseEnter={() => onHoverChange(true)}
			onMouseLeave={() => onHoverChange(false)}
			className="relative z-10 overflow-hidden border shadow-xl rounded-2xl bg-surface border-line"
		>
			<div
				dir="ltr"
				className="flex items-center gap-3 border-b h-9 px-3.5 bg-surface-2 border-line"
			>
				<span className="flex gap-1.5 w-11">
					<span className="rounded-full size-2.5 bg-fill-3" />
					<span className="rounded-full size-2.5 bg-fill-3" />
					<span className="rounded-full size-2.5 bg-fill-3" />
				</span>
				<span
					dir="rtl"
					className="inline-flex items-center h-6 gap-2 px-3.5 mx-auto text-xs font-semibold border rounded-full bg-surface border-line text-fg-muted"
				>
					<Icon name="diamond" size={12} className="text-vip" />
					{t('setting.vip.previewAddress')}
				</span>
				<span className="w-11" />
			</div>

			<div ref={sceneRef} className="relative overflow-hidden aspect-[870/352]">
				<div
					className="absolute top-0 left-0 h-[352px] w-[870px] origin-top-left"
					style={{ transform: `scale(${width / SCENE_WIDTH})` }}
				>
					<FreeNewTab now={now} />
					<div
						className={cn(
							'absolute inset-0 transition-[clip-path] duration-1000 ease-[cubic-bezier(0.65,0,0.25,1)]',
							isPro
								? '[clip-path:inset(0)]'
								: '[clip-path:inset(0_0_0_100%)]'
						)}
					>
						<ProNewTab now={now} showCallouts={isPro} />
					</div>
					<div
						className={cn(
							'absolute inset-0 pointer-events-none [transition:translate_1000ms_cubic-bezier(0.65,0,0.25,1),opacity_200ms_ease]',
							isPro && '-translate-x-full',
							isWiping ? 'opacity-100' : 'opacity-0'
						)}
					>
						<span className="absolute inset-y-0 w-0.5 -right-px bg-image-fg shadow-[0_0_18px_4px_var(--color-image-fg-muted)]" />
						<span className="absolute grid -mt-5 rounded-full shadow-lg top-1/2 -right-5 size-10 place-items-center bg-image-fg text-vip">
							<Icon name="diamond" size={20} />
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
