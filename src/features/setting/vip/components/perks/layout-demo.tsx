import { t } from '@/common/i18n'
import { formatNumber } from '../../utils/format'

const SLOTS = [12, 72].flatMap((top) => [12, 84, 156, 228].map((left) => ({ left, top })))

const TILE_CLASS = 'absolute flex items-center justify-center w-15 h-12.5 rounded-xl'

export function LayoutDemo() {
	return (
		<div
			dir="ltr"
			className="relative border shadow-md h-33.5 w-75 rounded-2xl bg-surface border-line"
		>
			{SLOTS.map((slot) => (
				<span
					key={`${slot.left}-${slot.top}`}
					style={slot}
					className="absolute w-15 h-12.5 rounded-xl border-[1.5px] border-dashed border-line"
				/>
			))}
			<span
				className={`${TILE_CLASS} flex-col gap-1.5 px-2.5 left-21 top-3 bg-fill-2`}
			>
				<span className="w-full h-1.25 rounded-sm bg-fill-3" />
				<span className="w-[70%] h-1.25 rounded-sm bg-fill-3" />
			</span>
			<span
				className={`${TILE_CLASS} flex-col gap-1.5 px-2.25 left-57 top-3 bg-fill-2`}
			>
				<span className="flex items-center w-full gap-1">
					<span className="rounded-xs size-1.75 bg-fill-3" />
					<span className="flex-1 h-1 rounded-xs bg-fill-3" />
				</span>
				<span className="flex items-center w-full gap-1">
					<span className="rounded-xs size-1.75 border border-fill-3" />
					<span className="flex-1 h-1 rounded-xs bg-fill-3" />
				</span>
			</span>
			<span
				className={`${TILE_CLASS} left-21 top-18 bg-fill-2 text-lg font-black text-fg-muted`}
			>
				{formatNumber(18)}
			</span>
			<span
				className={`${TILE_CLASS} z-10 gap-1 left-39 top-18 text-sm font-black bg-warning-fill-2 text-fg-strong animate-pro-swap-b`}
			>
				<span className="rounded-full size-3 bg-warning" />
				{t('setting.vip.previewDegrees', { value: formatNumber(24) })}
			</span>
			<span
				className={`${TILE_CLASS} z-20 left-3 top-3 text-sm font-black bg-vip text-on-vip shadow-md shadow-vip-fill-2 animate-pro-swap-a`}
			>
				USD
			</span>
			<span
				className={`${TILE_CLASS} z-10 left-57 top-18 text-sm font-black bg-vip text-on-vip animate-pro-duplicate`}
			>
				EUR
				<span className="absolute grid text-sm font-black leading-none rounded-full -top-2 -right-2 size-5 place-items-center bg-warning text-on-warning">
					+
				</span>
			</span>
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				aria-hidden="true"
				className="absolute z-30 left-12.5 top-9 animate-pro-swap-a"
			>
				<path
					d="M5 3l14 7.5-6.2 1.6L9.6 18z"
					strokeWidth="1.5"
					strokeLinejoin="round"
					className="fill-fg-strong stroke-surface"
				/>
			</svg>
		</div>
	)
}
