import { t } from '@/common/i18n'
import { Icon } from '@/icons'
import { formatClock, formatNumber } from '../../utils/format'
import { jalaliDateParts } from '../../utils/jalali-calendar'

const CARD_CLASS =
	'h-23 rounded-xl bg-[#ffffff] px-3 py-2.5 shadow-md shadow-[#1e1e3c33] leading-tight'

const TODO_BARS = ['w-21', 'w-16', 'w-18.5']

export function FreeNewTab({ now }: { now: Date }) {
	const date = jalaliDateParts(now)

	return (
		<div className="absolute inset-0 bg-[#dce1e9] text-[#15162b]">
			<svg
				aria-hidden="true"
				viewBox="0 0 870 352"
				preserveAspectRatio="xMidYMid slice"
				className="absolute inset-0 size-full"
			>
				<circle cx="690" cy="92" r="30" fill="#eef1f5" />
				<path
					d="M0 250L120 192L210 230L330 162L450 226L560 182L690 236L800 196L870 220V352H0Z"
					fill="#b8c1cc"
				/>
				<path d="M0 292Q150 246 300 286T600 280T870 270V352H0Z" fill="#9ea9b6" />
			</svg>

			<div className="absolute inset-x-0 text-center top-6.5 text-[#2f3442]">
				<div className="text-4xl font-light leading-tight">
					{formatClock(now)}
				</div>
				<div className="text-xs font-semibold text-[#4b4e66]">
					{t('setting.vip.previewDate', date)}
				</div>
			</div>

			<div className="absolute flex items-center h-10 gap-2 px-4 text-xs font-medium rounded-full top-29 left-1/2 -ml-42.5 w-85 bg-[#ffffff] text-[#686b83] shadow-md">
				<Icon name="search" size={16} />
				<span>{t('setting.vip.previewSearch')}</span>
			</div>

			<div className="absolute inset-x-0 flex justify-center gap-3 bottom-5">
				<div className={`${CARD_CLASS} flex w-29.5 flex-col justify-between`}>
					<span className="font-bold text-2xs text-[#5a5d75]">
						{t('setting.vip.previewTehran')}
					</span>
					<span className="text-2xl font-black">
						{t('setting.vip.previewDegrees', { value: formatNumber(22) })}
					</span>
					<span className="text-2xs text-[#5a5d75]">
						{t('setting.vip.previewCloudy')}
					</span>
				</div>

				<div className={`${CARD_CLASS} flex w-37.5 flex-col gap-2`}>
					<span className="font-extrabold text-2xs">
						{t('setting.vip.previewTodos')}
					</span>
					{TODO_BARS.map((width) => (
						<span key={width} className="flex items-center gap-1.5">
							<span className="size-2.5 rounded-sm border-[1.5px] border-[#c5c8d6]" />
							<span className={`h-1.5 rounded-sm bg-[#e6e8ef] ${width}`} />
						</span>
					))}
				</div>

				<div
					className={`${CARD_CLASS} flex w-26 flex-col items-center justify-between`}
				>
					<span className="font-bold text-2xs text-[#5a5d75]">
						{date.weekday}
					</span>
					<span className="text-2xl font-black">{date.day}</span>
					<span className="text-2xs text-[#5a5d75]">{date.month}</span>
				</div>

				{[0, 1].map((slot) => (
					<div
						key={slot}
						className="flex flex-col items-center justify-center gap-1 font-extrabold border-dashed rounded-xl size-23 text-2xs border-[1.5px] bg-[#ffffff80] border-[#3c405a59] text-[#4b4e66]"
					>
						<Icon name="lock" size={16} />
						{t('setting.vip.proLabel')}
					</div>
				))}
			</div>
		</div>
	)
}
