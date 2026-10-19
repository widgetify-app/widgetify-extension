import type React from 'react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { t } from '@/common/i18n'
import { Presence, Motion as motion } from '@/common/motion'
import { cn } from '@/common/utils/cn'
import {
	Button,
	ColorPicker,
	Portal,
	Slider,
	TabNavigation,
	Tooltip,
	VipBadge,
} from '@/components/ui'
import { useWallpaperTheme } from '../../hooks/use-wallpaper-theme'
import {
	CLOCK_COLOR_PRESETS,
	CLOCK_FACE_LABELS,
	CLOCK_FINISH_LABELS,
	CLOCK_SCALE_RANGE,
	CLOCK_WEIGHT_RANGE,
	GLASS_TINT_RANGE,
	TRANSPARENT_CLOCK_FACES,
} from '../constants'
import type {
	TransparentClockColor,
	TransparentClockDatePosition,
	TransparentClockFace,
	TransparentClockFinish,
	TransparentClockScript,
	TransparentClockStyle,
} from '../types'
import { getClockDigitsPaint } from '../utils/clock-paint'

type EditorTab = 'style' | 'shape' | 'color'

const FACE_SAMPLE = '12'
const STACKED_SAMPLE_MINUTES = '34'
const PLAIN_INK = { isDerivedFromWallpaper: false, inkHsl: '' }
const SPOTLIGHT_PADDING = 8
const COLOR_WHEEL_GRADIENT =
	'conic-gradient(hsl(0 90% 60%), hsl(60 90% 55%), hsl(120 70% 50%), hsl(180 80% 50%), hsl(240 80% 65%), hsl(300 80% 60%), hsl(360 90% 60%))'

interface ClockStyleEditorProps {
	isOpen: boolean
	anchorRef: React.RefObject<HTMLElement | null>
	clockStyle: TransparentClockStyle
	script: TransparentClockScript
	onChange: (next: Partial<TransparentClockStyle>) => void
	onSave: () => void
	onCancel: () => void
	isVip: boolean
	onUpgrade: () => void
	canStack: boolean
}

export function ClockStyleEditor({
	isOpen,
	anchorRef,
	clockStyle,
	script,
	onChange,
	onSave,
	onCancel,
	isVip,
	onUpgrade,
	canStack,
}: ClockStyleEditorProps) {
	const [tab, setTab] = useState<EditorTab>('style')
	const spotlight = useAnchorRect(anchorRef, isOpen)
	const proIcon = isVip ? undefined : <VipBadge size="xs" iconOnly />
	const isLocked = !isVip && tab !== 'shape'

	useEffect(() => {
		if (isOpen) setTab(isVip ? 'style' : 'shape')
	}, [isOpen, isVip])

	useEffect(() => {
		if (!isOpen) return
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onCancel()
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onCancel])

	return (
		<Portal topLayer>
			<Presence>
				{isOpen && spotlight && (
					<motion.div
						key="clock-style-spotlight"
						className="fixed inset-0 pointer-events-auto"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						onClick={onSave}
					>
						<div
							className="absolute rounded-widget"
							style={{
								top: spotlight.top - SPOTLIGHT_PADDING,
								left: spotlight.left - SPOTLIGHT_PADDING,
								width: spotlight.width + SPOTLIGHT_PADDING * 2,
								height: spotlight.height + SPOTLIGHT_PADDING * 2,
								boxShadow: '0 0 0 200vmax var(--color-scrim)',
							}}
						/>
					</motion.div>
				)}

				{isOpen && (
					<motion.div
						key="clock-style-bar"
						role="dialog"
						aria-label={t('widgets.transparentClock.customize')}
						className="fixed inset-x-0 flex flex-col gap-3 p-3 mx-auto border shadow-xl pointer-events-auto bottom-4 w-[min(36rem,calc(100vw-2rem))] bg-glass-surface-2 border-line rounded-2xl"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 24 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
					>
						<div className="flex items-center justify-between gap-2">
							<Button
								size="sm"
								variant="ghost"
								rounded="xl"
								onClick={onCancel}
							>
								{t('widgets.transparentClock.cancel')}
							</Button>
							<TabNavigation<EditorTab>
								size="sm"
								tabMode="simple"
								activeTab={tab}
								onTabClick={setTab}
								tabs={[
									{
										id: 'style',
										label: t('widgets.transparentClock.tab.style'),
										icon: proIcon,
									},
									{
										id: 'shape',
										label: t('widgets.transparentClock.tab.shape'),
									},
									{
										id: 'color',
										label: t('widgets.transparentClock.tab.color'),
										icon: proIcon,
									},
								]}
							/>
							<Button
								size="sm"
								variant="solid"
								color="brand"
								rounded="xl"
								onClick={onSave}
							>
								{t('widgets.transparentClock.done')}
							</Button>
						</div>

						<div className="relative flex items-center justify-center min-h-20">
							<div
								inert={isLocked ? true : undefined}
								className={cn(
									'flex items-center justify-center w-full',
									isLocked && 'opacity-40 pointer-events-none'
								)}
							>
								{tab === 'style' && (
									<StyleTab
										clockStyle={clockStyle}
										script={script}
										canStack={canStack}
										onChange={onChange}
									/>
								)}
								{tab === 'shape' && (
									<ShapeTab
										clockStyle={clockStyle}
										onChange={onChange}
									/>
								)}
								{tab === 'color' && (
									<ColorTab
										clockStyle={clockStyle}
										onChange={onChange}
									/>
								)}
							</div>
							{isLocked && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="flex items-center gap-3 px-3 py-2 border shadow-md rounded-xl bg-glass-surface-2 border-line">
										<span className="text-xs font-medium text-fg">
											{t('widgets.transparentClock.proOnly')}
										</span>
										<Button
											size="sm"
											variant="solid"
											color="vip"
											rounded="xl"
											onClick={onUpgrade}
										>
											{t('widgets.transparentClock.upgrade')}
										</Button>
									</div>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</Presence>
		</Portal>
	)
}

function useAnchorRect(anchorRef: React.RefObject<HTMLElement | null>, isOpen: boolean) {
	const [rect, setRect] = useState<DOMRect | null>(null)

	useLayoutEffect(() => {
		if (!isOpen) {
			setRect(null)
			return
		}
		const measure = () => {
			if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect())
		}
		measure()
		window.addEventListener('resize', measure)
		window.addEventListener('scroll', measure, true)
		return () => {
			window.removeEventListener('resize', measure)
			window.removeEventListener('scroll', measure, true)
		}
	}, [anchorRef, isOpen])

	return rect
}

interface TabProps {
	clockStyle: TransparentClockStyle
	onChange: (next: Partial<TransparentClockStyle>) => void
}

function StyleTab({
	clockStyle,
	script,
	canStack,
	onChange,
}: TabProps & { script: TransparentClockScript; canStack: boolean }) {
	return (
		<div className="flex flex-col w-full gap-2">
			<div className="grid grid-cols-3 gap-1">
				{TRANSPARENT_CLOCK_FACES.map((face) => (
					<FaceOption
						key={face}
						face={face}
						weight={clockStyle.weight}
						script={script}
						isSelected={clockStyle.face === face}
						disabled={face === 'stacked' && !canStack}
						onSelect={() => onChange({ face })}
					/>
				))}
			</div>
			<TabNavigation<TransparentClockDatePosition>
				className="self-center"
				size="sm"
				tabMode="simple"
				activeTab={clockStyle.datePosition}
				onTabClick={(datePosition) => onChange({ datePosition })}
				tabs={[
					{ id: 'above', label: t('widgets.transparentClock.date.above') },
					{ id: 'below', label: t('widgets.transparentClock.date.below') },
					{ id: 'hidden', label: t('widgets.transparentClock.date.hidden') },
				]}
			/>
		</div>
	)
}

function ShapeTab({ clockStyle, onChange }: TabProps) {
	return (
		<div className="flex flex-col w-full gap-2">
			<CompactSlider
				label={t('widgets.transparentClock.weightLabel')}
				value={clockStyle.weight}
				range={CLOCK_WEIGHT_RANGE}
				onChange={(weight) => onChange({ weight })}
			/>
			<CompactSlider
				label={t('widgets.transparentClock.sizeLabel')}
				valueLabel={t('widgets.transparentClock.sizeValue', {
					value: Math.round(clockStyle.scale * 100).toLocaleString('fa-IR'),
				})}
				value={clockStyle.scale}
				range={CLOCK_SCALE_RANGE}
				onChange={(scale) => onChange({ scale })}
			/>
		</div>
	)
}

function ColorTab({ clockStyle, onChange }: TabProps) {
	const theme = useWallpaperTheme()
	const isGlass = clockStyle.finish === 'glass'
	const isCustomColor =
		clockStyle.color !== 'wallpaper' &&
		!(CLOCK_COLOR_PRESETS as readonly string[]).includes(clockStyle.color)

	return (
		<div className="flex flex-col w-full gap-3">
			<div className="flex items-center gap-3">
				<TabNavigation<TransparentClockFinish>
					size="sm"
					tabMode="simple"
					activeTab={clockStyle.finish}
					onTabClick={(finish) => onChange({ finish })}
					tabs={[
						{ id: 'solid', label: t(CLOCK_FINISH_LABELS.solid) },
						{ id: 'glass', label: t(CLOCK_FINISH_LABELS.glass) },
					]}
				/>
				{isGlass && (
					<div className="flex-1">
						<CompactSlider
							label={t('widgets.transparentClock.tintLabel')}
							value={clockStyle.glassTint}
							range={GLASS_TINT_RANGE}
							onChange={(glassTint) => onChange({ glassTint })}
						/>
					</div>
				)}
			</div>

			<div className="flex flex-wrap items-center justify-center gap-2">
				<Swatch
					label={t('widgets.transparentClock.color.wallpaper')}
					hasTooltip
					isSelected={clockStyle.color === 'wallpaper'}
					onSelect={() => onChange({ color: 'wallpaper' })}
					className={cn(!theme.isDerivedFromWallpaper && 'bg-fg')}
					style={
						theme.isDerivedFromWallpaper
							? { backgroundColor: theme.primaryColor }
							: undefined
					}
				/>
				{CLOCK_COLOR_PRESETS.map((color) => (
					<Swatch
						key={color}
						label={color}
						isSelected={clockStyle.color === color}
						onSelect={() => onChange({ color })}
						style={{ backgroundColor: color }}
					/>
				))}
				<ColorPicker
					color={clockStyle.color === 'wallpaper' ? '' : clockStyle.color}
					onChange={(color) =>
						onChange({ color: color.toLowerCase() as TransparentClockColor })
					}
					className={cn(
						'size-7 p-0 rounded-full border border-line shadow-none',
						isCustomColor &&
							'ring-2 ring-brand ring-offset-2 ring-offset-surface'
					)}
					style={
						isCustomColor
							? undefined
							: { backgroundImage: COLOR_WHEEL_GRADIENT }
					}
				/>
			</div>
		</div>
	)
}

interface FaceOptionProps {
	face: TransparentClockFace
	weight: number
	script: TransparentClockScript
	isSelected: boolean
	disabled: boolean
	onSelect: () => void
}

function FaceOption({
	face,
	weight,
	script,
	isSelected,
	disabled,
	onSelect,
}: FaceOptionProps) {
	const paint = getClockDigitsPaint(
		{
			face,
			weight,
			scale: 1,
			finish: 'solid',
			color: 'wallpaper',
			glassTint: 0,
			datePosition: 'below',
		},
		PLAIN_INK,
		'none'
	)

	return (
		<button
			type="button"
			aria-pressed={isSelected}
			disabled={disabled}
			onClick={onSelect}
			className={cn(
				'flex flex-col items-center justify-end gap-1 py-1.5 rounded-xl cursor-pointer transition-ui focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40',
				isSelected ? 'bg-brand-fill text-brand' : 'text-fg hover:bg-fill-2'
			)}
		>
			<span
				dir="ltr"
				aria-hidden="true"
				className={cn(
					'flex leading-none',
					face === 'stacked' && 'flex-col items-center',
					script === 'latin' && 'font-latin'
				)}
				style={{
					...paint.style,
					fontSize: face === 'stacked' ? '0.75rem' : '1.375rem',
				}}
			>
				{face === 'stacked' ? (
					<>
						<span>{FACE_SAMPLE}</span>
						<span>{STACKED_SAMPLE_MINUTES}</span>
					</>
				) : (
					FACE_SAMPLE
				)}
			</span>
			<span className="text-3xs font-medium">{t(CLOCK_FACE_LABELS[face])}</span>
		</button>
	)
}

interface CompactSliderProps {
	label: string
	value: number
	range: { min: number; max: number; step: number }
	valueLabel?: string
	onChange: (value: number) => void
}

function CompactSlider({
	label,
	value,
	range,
	valueLabel,
	onChange,
}: CompactSliderProps) {
	return (
		<div className="flex items-center gap-3">
			<span className="w-24 text-xs text-fg-muted shrink-0">
				{valueLabel ? `${label} ${valueLabel}` : label}
			</span>
			<div dir="ltr" className="flex flex-1">
				<Slider
					label={label}
					value={value}
					min={range.min}
					max={range.max}
					step={range.step}
					onChange={onChange}
				/>
			</div>
		</div>
	)
}

interface SwatchProps {
	label: string
	isSelected: boolean
	onSelect: () => void
	hasTooltip?: boolean
	disabled?: boolean
	className?: string
	style?: React.CSSProperties
}

function Swatch({
	label,
	isSelected,
	onSelect,
	hasTooltip,
	disabled,
	className,
	style,
}: SwatchProps) {
	const swatch = (
		<button
			type="button"
			aria-label={label}
			aria-pressed={isSelected}
			disabled={disabled}
			onClick={onSelect}
			className={cn(
				'size-7 rounded-full border border-line cursor-pointer transition-ui focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40',
				isSelected && 'ring-2 ring-brand ring-offset-2 ring-offset-surface',
				className
			)}
			style={style}
		/>
	)

	return hasTooltip ? (
		<Tooltip content={label} delay={300}>
			{swatch}
		</Tooltip>
	) : (
		swatch
	)
}
