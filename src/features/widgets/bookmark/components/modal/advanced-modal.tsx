import { useCallback, useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { Button, Modal, Spinner } from '@/components/ui'
import { ColorPicker } from '@/components/ui'
import { TextInput } from '@/components/ui'
import { getEmojiList } from '@/services/emoji/get-emoji-list'
import { BookmarkItem } from '../bookmark-item'
import type { BookmarkType } from '@/services/bookmark/bookmark.interface'
import { Icon } from '@/icons'

interface AdvancedModalProps {
	title: string
	onClose: (
		data: {
			background: string | null
			textColor: string | null
			sticker: string | null
		} | null
	) => void
	isOpen: boolean
	bookmark: {
		customBackground: string | null
		customTextColor: string | null
		sticker: string | null
		type: BookmarkType
		title: string
		url: string | null
		icon: any
	}
}

export function AdvancedModal({ title, onClose, isOpen, bookmark }: AdvancedModalProps) {
	const emojiPopoverRef = useRef<HTMLDivElement>(null)

	const [background, setBackground] = useState(bookmark.customBackground)
	const [textColor, setTextColor] = useState(bookmark.customTextColor)
	const [sticker, setSticker] = useState(bookmark.sticker || '')

	const [isEmojiPopoverOpen, setIsEmojiPopoverOpen] = useState(false)
	const [emojiUrls, setEmojiUrls] = useState<string[]>([])
	const [isLoadingEmojis, setIsLoadingEmojis] = useState(false)

	useEffect(() => {
		if (isOpen) {
			setIsLoadingEmojis(true)

			getEmojiList()
				.then((urls) => {
					if (urls.length > 0) {
						setEmojiUrls(urls)
					}
				})
				.finally(() => {
					setIsLoadingEmojis(false)
				})

			Analytics.event('open_advanced_bookmark_customization', {
				bookmark_type: bookmark.type,
			})
		}
	}, [isOpen])

	useEffect(() => {
		setBackground(bookmark.customBackground)
		setTextColor(bookmark.customTextColor)
		setSticker(bookmark.sticker || '')
	}, [bookmark.customBackground, bookmark.customTextColor, bookmark.sticker])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				emojiPopoverRef.current &&
				!emojiPopoverRef.current.contains(event.target as Node)
			) {
				setIsEmojiPopoverOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleEmojiSelect = useCallback(
		(selectedEmoji: string) => {
			const newEmoji = sticker === selectedEmoji ? '' : selectedEmoji
			setSticker(newEmoji)
			setIsEmojiPopoverOpen(false)
		},
		[sticker]
	)

	const toggleEmojiPopover = () => {
		setIsEmojiPopoverOpen((prev) => !prev)
	}

	const renderEmojiGrid = () => {
		if (isLoadingEmojis) {
			return (
				<div className="flex items-center justify-center w-full p-4">
					<Spinner size="lg" />
				</div>
			)
		}

		return (
			<div className="grid grid-cols-8 gap-1.5">
				{emojiUrls.map((url) => (
					<button
						type="button"
						key={url}
						onClick={() => handleEmojiSelect(url)}
						className={`flex items-center justify-center w-7 h-7 cursor-pointer rounded-lg transition-ui duration-150 ease-in-out
							${
								sticker === url
									? 'bg-brand-fill-2 border-2 border-brand transform scale-110'
									: 'border border-transparent hover:bg-fill-2 active:bg-fill-3'
							}`}
					>
						<img
							src={url}
							alt="emoji"
							className="object-contain w-5 h-5"
							onError={(e) => {
								;(e.target as HTMLImageElement).style.display = 'none'
							}}
							loading="lazy"
						/>
					</button>
				))}
			</div>
		)
	}

	const resetBackground = () => {
		setBackground(null)
	}

	const resetTextColor = () => {
		setTextColor(null)
	}

	function handleClose() {
		onClose({
			background: background,
			textColor: textColor,
			sticker: sticker,
		})
	}

	return (
		<Modal title={title} isOpen={isOpen} onClose={() => onClose(null)}>
			<div className={'flex flex-col gap-4 rounded-lg'}>
				<div className="relative z-30">
					<label
						htmlFor="bookmark-background-color"
						className={'block text-sm font-medium mb-1.5 text-fg'}
					>
						رنگ پس زمینه (اختیاری)
					</label>
					<div className="relative flex flex-1 gap-0.5">
						<TextInput
							id="bookmark-background-color"
							type="text"
							value={background || ''}
							onChange={setBackground}
							className="w-full px-3 py-2 pl-24 pr-10 rounded-2xl"
							placeholder="#000000"
							debounce={true}
						/>
						<div className="absolute flex items-center gap-2 -translate-y-1/2 right-1 top-1/2">
							<ColorPicker
								color={background || ''}
								onChange={setBackground}
							/>
						</div>
						<Button
							type="button"
							onClick={resetBackground}
							size="md"
							className="p-3!"
							rounded={'2xl'}
						>
							<Icon name="reload" className="w-4 h-4" />
						</Button>
					</div>
				</div>

				<div className="relative z-20">
					<label
						htmlFor="bookmark-text-color"
						className={'block text-sm font-medium mb-1.5 text-fg'}
					>
						رنگ متن (اختیاری)
					</label>
					<div className="relative flex flex-1 gap-0.5">
						<TextInput
							id="bookmark-text-color"
							type="text"
							value={textColor || ''}
							onChange={setTextColor}
							className="w-full px-3 py-2 pl-24 pr-10 rounded-2xl"
							placeholder="#000000"
							debounce={true}
						/>
						<div className="absolute flex items-center gap-2 -translate-y-1/2 right-1 top-1/2">
							<ColorPicker
								color={textColor || ''}
								onChange={setTextColor}
							/>
						</div>
						<Button
							type="button"
							onClick={resetTextColor}
							size="md"
							className="p-3!"
							rounded={'2xl'}
						>
							<Icon name="reload" className="w-4 h-4" />
						</Button>
					</div>
				</div>

				<div className="relative z-10" ref={emojiPopoverRef}>
					<p className={'block text-sm font-medium mb-1.5 text-fg'}>
						انتخاب استیکر (اختیاری)
					</p>

					<div className="flex items-center gap-2 mt-1">
						<Button
							size="md"
							type="button"
							onClick={toggleEmojiPopover}
							className={'w-fit! px-8'}
							rounded={'2xl'}
						>
							{sticker ? (
								<>
									{sticker.startsWith('http') ? (
										<img
											src={sticker}
											alt="selected emoji"
											className="w-6 h-6 ml-2"
										/>
									) : (
										<span
											className="ml-2 text-lg"
											style={{
												fontFamily:
													"'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
											}}
										>
											{sticker}
										</span>
									)}
									<span className="text-xs font-medium">
										تغییر استیکر
									</span>
								</>
							) : (
								<span className="text-xs font-medium">انتخاب استیکر</span>
							)}
						</Button>

						{sticker && (
							<button
								type="button"
								onClick={() => handleEmojiSelect(sticker)}
								className={
									'px-3 py-1.5 cursor-pointer text-xs rounded-lg text-danger hover:bg-danger-fill'
								}
							>
								حذف
							</button>
						)}
					</div>

					{/* Emoji Popover */}
					{isEmojiPopoverOpen && (
						<div
							className={
								'absolute mt-1 p-2 w-64 max-h-32 overflow-y-auto rounded-xl backdrop-blur-lg border border-surface-3'
							}
							style={{ zIndex: 'var(--z-dropdown)' }}
						>
							{renderEmojiGrid()}
						</div>
					)}
				</div>

				<div className="pt-2 space-y-2">
					<p className={'block text-sm font-medium text-fg'}>پیش‌نمایش:</p>
					<div
						className="flex justify-center p-4 overflow-hidden rounded-lg"
						style={{
							backgroundImage: document.body.style.backgroundImage,
							backgroundColor: document.body.style.backgroundColor,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						<div className="w-22 h-22">
							<BookmarkItem
								bookmark={{
									customBackground: background,
									customTextColor: textColor,
									sticker: sticker,
									order: null,
									icon: bookmark.icon,
									title: bookmark.title || 'پیش‌نمایش',
									url: 'https://widgetify.ir',
									id: 'preview',
									isLocal: false,
									onlineId: null,
									parentId: null,
									type: bookmark.type,
								}}
								onClick={() => {}}
							/>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-2 mt-4">
					<Button
						size="md"
						onClick={() => onClose(null)}
						rounded={'2xl'}
						className="w-20 transition-colors duration-300 ease-in-out shadow-none rounded-2xl"
					>
						لغو
					</Button>
					<Button
						type="submit"
						onClick={() => handleClose()}
						size="md"
						color={'brand'}
						rounded={'2xl'}
						className={'w-fit px-8  border-none'}
					>
						ذخیره
					</Button>
				</div>
			</div>
		</Modal>
	)
}
