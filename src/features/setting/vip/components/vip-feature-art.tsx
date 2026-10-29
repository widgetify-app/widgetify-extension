import type { ReactNode } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { VipBadge } from '@/components/ui'
import { Icon } from '@/icons'
import wallpaperArt from '@/assets/images/pro/wallpaper.webp'

const WIDGET_CARD =
	'rounded-2xl border border-surface-3 bg-surface shadow-sm text-fg-strong'

const faDigits = (value: number, minimumIntegerDigits = 1) =>
	new Intl.NumberFormat('fa-IR', { minimumIntegerDigits, useGrouping: false }).format(
		value
	)

const faTime = (hours: number, minutes: number) =>
	`${faDigits(hours, 2)}:${faDigits(minutes, 2)}`

const faDegrees = (value: number) => `${faDigits(value)}°`

function MiniClock({ hours, minutes }: { hours: number; minutes: number }) {
	return (
		<span className="px-2 py-1 text-sm font-black rounded-lg border border-surface-3 bg-surface text-fg-strong tabular-nums">
			{faTime(hours, minutes)}
		</span>
	)
}

function Avatar({ className, size = 24 }: { className: string; size?: 16 | 24 | 32 }) {
	return (
		<span
			className={cn(
				'grid place-items-center rounded-full border-2 border-surface shadow-sm',
				className
			)}
		>
			<Icon name="user" size={size} />
		</span>
	)
}

function WallpaperThumb({
	className,
	position,
}: {
	className: string
	position: string
}) {
	return (
		<span
			className={cn(
				'absolute rounded-lg border border-image-line bg-cover shadow-sm',
				className
			)}
			style={{
				backgroundImage: `url(${wallpaperArt})`,
				backgroundPosition: position,
			}}
		/>
	)
}

export function LayoutCardArt() {
	return (
		<>
			<MiniClock hours={12} minutes={45} />
			<MiniClock hours={9} minutes={15} />
		</>
	)
}

export function WidgetsCardArt() {
	return (
		<>
			<span className="w-5 h-5 rounded-lg bg-brand-fill-2" />
			<span className="rounded-lg w-7.5 h-7.5 bg-brand-muted" />
			<span className="h-7.5 w-11.5 rounded-lg bg-brand" />
		</>
	)
}

export function WallpaperCardArt() {
	return (
		<>
			<WallpaperThumb
				className="w-15 h-9 -rotate-8 -translate-x-6 opacity-60"
				position="15% 70%"
			/>
			<WallpaperThumb
				className="w-15 h-9 rotate-8 translate-x-6 opacity-60"
				position="85% 30%"
			/>
			<WallpaperThumb className="w-15 h-9" position="center 65%" />
		</>
	)
}

export function GalleryCardArt() {
	return (
		<>
			<Avatar className="w-6.5 h-6.5 bg-warning-fill-2 text-warning" size={16} />
			<Avatar className="w-6.5 h-6.5 bg-brand-fill-2 text-brand" size={16} />
			<span className="grid rounded-lg w-6.5 h-6.5 place-items-center border border-surface-3 bg-surface text-danger shadow-sm">
				<Icon name="heart" size={14} />
			</span>
			<Avatar className="w-6.5 h-6.5 bg-success-fill-2 text-success" size={16} />
		</>
	)
}

function CityClock({
	city,
	hours,
	minutes,
}: {
	city: MessageKey
	hours: number
	minutes: number
}) {
	return (
		<span
			className={cn(
				WIDGET_CARD,
				'flex flex-col items-center justify-center w-32 h-20'
			)}
		>
			<span className="text-2xs text-fg-muted">{t(city)}</span>
			<span className="text-2xl font-black leading-tight tabular-nums">
				{faTime(hours, minutes)}
			</span>
		</span>
	)
}

function CityWeather({ city, degrees }: { city: MessageKey; degrees: number }) {
	return (
		<span
			className={cn(
				WIDGET_CARD,
				'flex items-center justify-between w-52 h-20 px-4'
			)}
		>
			<span className="text-warning">
				<Icon name="sun" size={24} />
			</span>
			<span className="flex flex-col items-end">
				<span className="text-2xs text-fg-muted">{t(city)}</span>
				<span className="text-2xl font-black leading-tight tabular-nums">
					{faDegrees(degrees)}
				</span>
			</span>
		</span>
	)
}

export function LayoutStage() {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex gap-4">
				<CityClock
					city="setting.vipFeatures.cityTehran"
					hours={12}
					minutes={45}
				/>
				<CityClock
					city="setting.vipFeatures.cityIstanbul"
					hours={12}
					minutes={15}
				/>
				<CityClock city="setting.vipFeatures.cityLondon" hours={9} minutes={15} />
			</div>
			<div className="flex gap-4">
				<CityWeather city="setting.vipFeatures.cityTehran" degrees={18} />
				<CityWeather city="setting.vipFeatures.cityTabriz" degrees={9} />
			</div>
		</div>
	)
}

function AnalogClock() {
	return (
		<svg
			viewBox="0 0 40 40"
			aria-hidden="true"
			className="w-11 h-11 fill-none stroke-fg-strong"
		>
			<circle cx="20" cy="20" r="17" strokeWidth="2" />
			<path d="M20 20V9M20 20l7 4" strokeWidth="2" strokeLinecap="round" />
		</svg>
	)
}

function PriceChart() {
	return (
		<svg
			viewBox="0 0 200 56"
			preserveAspectRatio="none"
			aria-hidden="true"
			className="flex-1 h-9"
		>
			<path
				d="M0 44 L25 40 L50 46 L75 30 L100 34 L125 20 L150 26 L175 12 L200 16"
				className="fill-none stroke-brand"
				strokeWidth="2.5"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}

export function WidgetsStage() {
	return (
		<div className="flex gap-6">
			<div className="flex flex-col gap-3">
				<span
					className={cn(
						WIDGET_CARD,
						'flex flex-col justify-between w-36 h-36 p-4'
					)}
				>
					<span className="text-warning">
						<Icon name="sun" size={32} />
					</span>
					<span className="text-4xl font-black leading-tight tabular-nums">
						{faDegrees(18)}
					</span>
					<span className="flex gap-1.5">
						<span className="flex-1 h-1.5 rounded-sm bg-brand-muted" />
						<span className="flex-1 h-1.5 rounded-sm bg-brand-fill-2" />
						<span className="flex-1 h-1.5 rounded-sm bg-brand-fill-2" />
					</span>
				</span>
				<span className={cn(WIDGET_CARD, 'grid w-16 h-16 place-items-center')}>
					<span className="text-lg font-black tabular-nums">
						{faDegrees(18)}
					</span>
				</span>
			</div>
			<div className="flex flex-col gap-3 w-52">
				<span className={cn(WIDGET_CARD, 'grid h-18 place-items-center')}>
					<span className="text-3xl font-black tabular-nums">
						{faTime(12, 45)}
					</span>
				</span>
				<span className="flex gap-3">
					<span
						className={cn(WIDGET_CARD, 'grid flex-1 h-18 place-items-center')}
					>
						<AnalogClock />
					</span>
					<span
						className={cn(
							WIDGET_CARD,
							'flex flex-col flex-1 h-18 items-center justify-center text-xl font-black leading-tight tabular-nums'
						)}
					>
						<span>{faDigits(12, 2)}</span>
						<span className="font-normal">{faDigits(45, 2)}</span>
					</span>
				</span>
				<span className={cn(WIDGET_CARD, 'flex items-center gap-3 h-16 px-3')}>
					<span className="text-sm font-black tabular-nums">
						{new Intl.NumberFormat('fa-IR').format(68200)}
					</span>
					<PriceChart />
				</span>
			</div>
		</div>
	)
}

function NewTab({
	className,
	position,
	front,
}: {
	className?: string
	position: string
	front?: boolean
}) {
	return (
		<span
			className={cn(
				'absolute w-68 h-42 overflow-hidden bg-cover rounded-2xl border-2 border-image-line shadow-lg',
				className
			)}
			style={{
				backgroundImage: `url(${wallpaperArt})`,
				backgroundPosition: position,
			}}
		>
			{front && (
				<span className="absolute w-42 h-6.5 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-image-fg shadow-sm" />
			)}
		</span>
	)
}

export function WallpaperStage({ maxUploadSize }: { maxUploadSize: number }) {
	return (
		<div className="relative flex flex-col items-center w-full h-full">
			<div className="relative w-68 h-42 mt-12">
				<NewTab
					className="inset-0 -translate-x-30 -rotate-9 scale-88 opacity-90"
					position="20% 70%"
				/>
				<NewTab
					className="inset-0 translate-x-30 rotate-9 scale-88 opacity-90"
					position="80% 30%"
				/>
				<NewTab className="inset-0" position="center 65%" front />
			</div>
			<span className="relative z-10 flex items-center gap-3 px-4 mt-5 h-13 rounded-2xl bg-surface shadow-lg">
				<span className="text-brand">
					<Icon name="uploadImage" size={20} />
				</span>
				<span className="text-sm font-bold text-fg-strong">
					{t('setting.wallpaperUpload.mediaUpToPrefix')}{' '}
					<span className="text-lg font-black text-brand tabular-nums">
						{faDigits(maxUploadSize)}
					</span>{' '}
					{t('setting.wallpaperUpload.megabyteUnit')}
				</span>
			</span>
		</div>
	)
}

function GalleryTile({ label, children }: { label: MessageKey; children: ReactNode }) {
	return (
		<span className="flex flex-col items-center gap-2.5">
			<span
				className={cn(WIDGET_CARD, 'relative grid w-34 h-34 place-items-center')}
			>
				{children}
			</span>
			<span className="text-sm font-bold text-image-fg">{t(label)}</span>
		</span>
	)
}

export function GalleryStage() {
	return (
		<div className="flex flex-col items-center gap-4">
			<VipBadge text={t('gallery.photo.freeWithPro')} />
			<div className="flex gap-5">
				<GalleryTile label="setting.vipFeatures.avatar">
					<Avatar className="w-21 h-21 bg-brand-fill-2 text-brand" size={32} />
				</GalleryTile>
				<GalleryTile label="setting.vipFeatures.bookmarkIcon">
					<span className="grid w-19 h-19 rounded-2xl place-items-center border border-surface-3 bg-surface-2 text-danger">
						<Icon name="heart" size={32} />
					</span>
				</GalleryTile>
				<GalleryTile label="setting.vipFeatures.photoWidget">
					<span
						className="absolute bg-cover inset-2 rounded-xl"
						style={{
							backgroundImage: `url(${wallpaperArt})`,
							backgroundPosition: 'center 60%',
						}}
					/>
				</GalleryTile>
			</div>
		</div>
	)
}

export function MoreStage() {
	return (
		<div className="flex gap-5">
			<span className={cn(WIDGET_CARD, 'flex flex-col w-56 h-48 overflow-hidden')}>
				<span className="flex items-center gap-1.5 px-3 py-2.5 border-b border-surface-3 bg-surface-2">
					<span className="w-2 h-2 rounded-full bg-danger" />
					<span className="w-2 h-2 rounded-full bg-warning" />
					<span className="w-2 h-2 rounded-full bg-success" />
					<span className="flex-1 h-2 rounded-sm ms-2 bg-fill-2" />
				</span>
				<span className="flex flex-col gap-2.5 p-3.5">
					<span className="h-2 rounded-sm w-11/12 bg-fill-2" />
					<span className="h-2 rounded-sm w-3/4 bg-fill-2" />
					<span className="h-2 rounded-sm w-5/6 bg-fill-2" />
					<span className="w-1/2 h-2 rounded-sm bg-fill-2" />
				</span>
			</span>
			<span className="flex flex-col gap-3">
				<span
					className={cn(
						WIDGET_CARD,
						'grid w-50 h-36 grid-cols-4 grid-rows-3 gap-1.5 p-3'
					)}
				>
					<span className="col-span-2 rounded-lg bg-brand" />
					<span className="col-span-2 rounded-lg bg-brand-muted" />
					<span className="row-span-2 rounded-lg bg-brand-fill-2" />
					<span className="col-span-3 rounded-lg bg-brand-fill-2" />
					<span className="col-span-3 rounded-lg bg-brand-muted" />
				</span>
				<span
					className={cn(
						WIDGET_CARD,
						'grid h-10 place-items-center text-fg-muted'
					)}
				>
					<Icon name="plus" size={20} />
				</span>
			</span>
		</div>
	)
}
