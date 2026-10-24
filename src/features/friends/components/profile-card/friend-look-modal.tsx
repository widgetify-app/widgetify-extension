import { useEffect, useState } from 'react'
import { t } from '@/common/i18n'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Button, EmptyState, Modal } from '@/components/ui'
import { Theme } from '@/context/theme.context'
import { bundledItemName, type StoreItem, ThemePreview } from '@/features/market/market'
import { StoreTryOnProvider, useStoreTryOn } from '@/features/market/store-try-on.context'
import { Icon } from '@/icons'
import {
	type FriendLook,
	type FriendLookItem,
	useGetFriendLook,
} from '@/services/friends/friend-service.hook'
import type { FriendLookTarget } from './profile-card'

export function FriendLookModalListener() {
	const [target, setTarget] = useState<FriendLookTarget | null>(null)
	const [isSteppedAside, setIsSteppedAside] = useState(false)

	useEffect(() => listenEvent('openFriendLook', setTarget), [])

	const close = () => {
		setTarget(null)
		setIsSteppedAside(false)
	}

	const stepAside = (aside: boolean) => {
		setIsSteppedAside(aside)
		if (aside) callEvent('close_friends_bottomSheet')
	}

	return (
		<Modal
			isOpen={Boolean(target)}
			onClose={close}
			size="md"
			stepAside={isSteppedAside}
			title={target ? t('friends.card.lookTitle', { name: target.name }) : ''}
		>
			<StoreTryOnProvider onStepAside={stepAside} onClose={close}>
				{target && <FriendLookContent target={target} />}
			</StoreTryOnProvider>
		</Modal>
	)
}

function FriendLookContent({ target }: { target: FriendLookTarget }) {
	const { data, isLoading, isError, refetch } = useGetFriendLook(target.username)

	if (isLoading) return <FriendLookSkeleton />

	if (isError || !data) {
		return (
			<div className="flex flex-col items-center gap-2 py-8 text-sm text-fg-muted">
				<p>{t('friends.card.lookLoadFailed')}</p>
				<Button size="xs" rounded="lg" onClick={() => refetch()}>
					{t('friends.card.retry')}
				</Button>
			</div>
		)
	}

	if (!data.wallpaper && !data.theme && !data.font) {
		return (
			<EmptyState
				icon="photo"
				title={t('friends.card.lookEmpty', { name: target.name })}
				className="py-8"
			/>
		)
	}

	return <FriendLookView look={data} />
}

function FriendLookSkeleton() {
	return (
		<div className="flex flex-col gap-3" aria-busy="true">
			<div className="rounded-2xl aspect-video skeleton" />
			<div className="flex flex-col gap-1">
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className="h-14 rounded-xl skeleton" />
				))}
			</div>
		</div>
	)
}

function FriendLookView({ look }: { look: FriendLook }) {
	const { tryOn } = useStoreTryOn()
	const [isWallpaperOnly, setIsWallpaperOnly] = useState(false)
	const { wallpaper, theme, font } = look
	const themeName = theme ? lookName('THEME', theme) : null
	const fontName = font ? lookName('FONT', font) : null

	return (
		<div className="flex flex-col gap-3">
			<div
				className="relative overflow-hidden rounded-2xl aspect-video bg-fill"
				style={font ? { fontFamily: font.value } : undefined}
			>
				{wallpaper && isWallpaperOnly ? (
					<img
						src={wallpaper.previewUrl}
						alt={wallpaper.name}
						className="absolute inset-0 object-cover size-full"
					/>
				) : (
					<ThemePreview
						theme={theme?.value ?? Theme.Light}
						backdrop={wallpaper?.previewUrl}
					/>
				)}
				{wallpaper && (
					<button
						type="button"
						aria-pressed={isWallpaperOnly}
						onClick={() => setIsWallpaperOnly(!isWallpaperOnly)}
						className={cn(
							'absolute flex items-center gap-1 px-2.5 py-1 font-medium rounded-full cursor-pointer bottom-2 start-2 text-2xs backdrop-glass transition-ui focus-visible:focus-ring',
							isWallpaperOnly
								? 'bg-brand text-on-brand hover:bg-brand-hover'
								: 'bg-scrim-soft text-image-fg hover:bg-scrim'
						)}
					>
						<Icon name="image" size={12} />
						{t('friends.card.lookWallpaperOnly')}
					</button>
				)}
			</div>

			<ul className="flex flex-col gap-1">
				{wallpaper && (
					<LookRow
						label={t('friends.card.lookWallpaper')}
						value={wallpaper.name}
						onTry={() =>
							tryOn({
								id: wallpaper.id,
								type: 'WALLPAPER',
								name: wallpaper.name,
								value: wallpaper.id,
								price: wallpaper.price,
								isOwned: wallpaper.owned,
								canTryOn: true,
								wallpaper: {
									id: wallpaper.id,
									name: wallpaper.name,
									type: wallpaper.type,
									src: wallpaper.previewUrl,
									previewSrc: wallpaper.previewUrl,
									coin: wallpaper.price,
									isOwned: wallpaper.owned,
								},
							})
						}
					/>
				)}
				{theme && themeName && (
					<LookRow
						label={t('friends.card.lookTheme')}
						value={themeName}
						onTry={() => tryOn(lookStoreItem('THEME', theme, themeName))}
					/>
				)}
				{font && fontName && (
					<LookRow
						label={t('friends.card.lookFont')}
						value={fontName}
						fontFamily={font.value}
						onTry={() => tryOn(lookStoreItem('FONT', font, fontName))}
					/>
				)}
			</ul>
		</div>
	)
}

function lookName(type: 'THEME' | 'FONT', item: FriendLookItem): string {
	return item.name ?? bundledItemName(type, item.value) ?? item.value
}

function lookStoreItem(
	type: 'THEME' | 'FONT',
	item: FriendLookItem,
	name: string
): StoreItem {
	return {
		id: item.itemId ?? `${type}-${item.value}`,
		type,
		name,
		value: item.value,
		price: item.price,
		isOwned: item.owned,
		canTryOn: true,
	}
}

function LookRow({
	label,
	value,
	fontFamily,
	onTry,
}: {
	label: string
	value: string
	fontFamily?: string
	onTry: () => void
}) {
	return (
		<li className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-fill">
			<span className="flex-1 min-w-0">
				<span className="block text-2xs text-fg-muted">{label}</span>
				<span
					className="block text-sm font-semibold truncate text-fg-strong"
					style={fontFamily ? { fontFamily } : undefined}
				>
					{value}
				</span>
			</span>
			<Button size="xs" rounded="lg" variant="outline" color="base" onClick={onTry}>
				{t('market.purchase.tryOn')}
			</Button>
		</li>
	)
}
