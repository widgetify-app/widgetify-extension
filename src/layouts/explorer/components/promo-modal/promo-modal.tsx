import { useState } from 'react'
import { showToast } from '@/common/toast'
import { Button, ImageSlider, Modal } from '@/components/ui'
import { Icon } from '@/icons'
import type { CatalogItem } from '../../interfaces/catalog-item.interface'

export interface ExplorerPromoModalProps {
	isOpen: boolean
	onClose: () => void
	item: CatalogItem | null
}

export function ExplorerPromoModal({ isOpen, onClose, item }: ExplorerPromoModalProps) {
	const [isCopied, setIsCopied] = useState(false)

	if (!item) return null

	const meta = item.meta as any
	const promo = meta?.promo
	const rawGallery = meta?.gallery
	const gallery: string[] = Array.isArray(rawGallery)
		? rawGallery
		: item.backgroundSrc
			? [item.backgroundSrc]
			: []
	const hasGallery = gallery.length > 1
	const title = meta?.title || item.name
	const description = meta?.description || item.description
	const highlights: string[] = Array.isArray(meta?.highlights) ? meta.highlights : []
	const isSponsor =
		item.badge === 'اسپانسر' || item.badgeColor?.includes('amber') || meta?.isSponsor

	const handleCopy = async (e?: React.MouseEvent) => {
		if (e) e.stopPropagation()
		if (!promo?.code) return

		try {
			await navigator.clipboard.writeText(promo.code)
			setIsCopied(true)
			showToast(`کد تخفیف ${promo.code} کپی شد`, 'success')
			setTimeout(() => setIsCopied(false), 2500)
		} catch {
			showToast('خطا در کپی کردن کد', 'error')
		}
	}

	const handleAction = () => {
		const targetUrl = promo?.targetUrl || item.url
		if (targetUrl) {
			const formattedUrl = targetUrl.startsWith('http')
				? targetUrl
				: `https://${targetUrl}`
			window.open(formattedUrl, '_blank', 'noopener,noreferrer')
		}
		if (promo?.code && !isCopied) {
			handleCopy()
		}
	}

	const ctaText = promo?.code ? 'کپی کد و ورود به سایت' : 'مشاهده و ورود'

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			direction="rtl"
			closeOnBackdropClick={true}
			showCloseButton={true}
			title=" "
		>
			<div className="space-y-3.5 pt-0.5">
				{/* Visual / Gallery Container */}
				{gallery.length > 0 && (
					<ImageSlider
						images={gallery}
						fallbackSrc={item.backgroundSrc}
						alt={title}
						mode="image"
						arrowVariant="glass"
						arrowsVisibility="always"
						dotsPosition="bottom-center"
						dotsVariant="dark"
						className="w-full h-36 rounded-2xl bg-base-200 border border-content group"
						overlay={
							<div className="absolute inset-0 bg-gradient-to-t from-base-100/80 via-transparent to-transparent pointer-events-none" />
						}
					/>
				)}

				<div className="space-y-1.5">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 min-w-0">
							{item.icon && (
								<img
									src={item.icon}
									alt={item.name}
									className="w-6 h-6 rounded-xl object-contain shrink-0 bg-base-200 border border-content p-0.5"
								/>
							)}
							<h3 className="text-base font-bold text-content truncate">
								{title}
							</h3>
						</div>
						{isSponsor && (
							<span className="badge badge-sm badge-neutral shrink-0 font-medium">
								اسپانسر
							</span>
						)}
					</div>

					{description && (
						<p className="text-xs text-muted leading-relaxed">
							{description}
						</p>
					)}
				</div>

				{highlights.length > 0 && (
					<div className="flex flex-wrap gap-1.5 pt-0.5">
						{highlights.map((h, i) => (
							<div
								key={i}
								className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-base-200 border border-content text-[11px] text-muted font-medium"
							>
								<Icon
									name="check"
									size={12}
									className="text-primary shrink-0"
								/>
								<span>{h}</span>
							</div>
						))}
					</div>
				)}

				{promo && (
					<div className="p-3 rounded-2xl bg-base-200 border border-content space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="font-semibold text-content">
								{promo.title || 'کد تخفیف اختصاصی'}
							</span>
							{promo.discount && (
								<span className="text-[11px] font-bold text-primary">
									{promo.discount}
								</span>
							)}
						</div>
						{promo.code && (
							<div className="flex items-center justify-between gap-2 p-1.5 pr-3 pl-1.5 rounded-xl bg-base-100 border border-content">
								<span className="font-mono text-xs font-bold text-primary tracking-wider select-all">
									{promo.code}
								</span>
								<Button
									size="sm"
									color={isCopied ? 'primary' : 'base'}
									variant={isCopied ? 'solid' : 'outline'}
									rounded="xl"
									className="h-7 text-xs px-2.5"
									onClick={handleCopy}
								>
									<Icon
										name={isCopied ? 'check' : 'copy'}
										size={13}
										className="ml-1"
									/>
									{isCopied ? 'کپی شد' : 'کپی'}
								</Button>
							</div>
						)}
					</div>
				)}

				<div className="flex items-center gap-2 pt-1">
					<Button
						onClick={onClose}
						size="md"
						variant="outline"
						rounded="2xl"
						className="text-xs px-4"
					>
						بستن
					</Button>
					<Button
						onClick={handleAction}
						size="md"
						color="primary"
						rounded="2xl"
						className="flex-1 text-xs"
					>
						<Icon name="externalLink" size={14} className="ml-1.5" />
						{ctaText}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
