import { useCallback, useEffect, useRef, useState } from 'react'
import { FiRotateCcw } from 'react-icons/fi'
import Analytics from '@/analytics'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import PopoverColorPicker from '@/components/PopoverColorPicker'
import { TextInput } from '@/components/text-input'
import { getEmojiList } from '@/services/emoji/emoji-api'
import { BookmarkItem } from '../bookmark-item'
import type { BookmarkType } from '../../types/bookmark.types'

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
					<div className="w-6 h-6 border-2 rounded-full border-t-blue-500 border-blue-500/30 animate-spin"></div>
				</div>
			)
		}

		return (
			<div className="grid grid-cols-8 gap-1.5">
				{emojiUrls.map((url) => (
					<button
						key={url}
						onClick={() => handleEmojiSelect(url)}
						className={`flex items-center justify-center w-7 h-7 cursor-pointer rounded-lg transition-all duration-150 ease-in-out
							${
								sticker === url
									? 'bg-blue-500/25 border-2 border-blue-500 transform scale-110'
									: 'border border-transparent hover:bg-gray-500/10 active:bg-gray-500/20'
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

	if (!isOpen) return null

	return (
		<Modal
			title={title}
			isOpen={isOpen}
			onClose={() => onClose(null)}
			direction="rtl"
		>
			<div className={'flex flex-col gap-4 rounded-lg'}>
				<div>
					<label className={'block text-sm font-medium mb-1.5 text-content'}>
						رنگ پس زمینه (اختیاری)
					</label>
					<div className="relative flex flex-1">
						<TextInput
							type="text"
							value={background || ''}
							onChange={setBackground}
							className="w-full px-3 py-2 pr-10 pl-24 !rounded-md"
							placeholder="#000000"
							debounce={true}
						/>
						<div className="absolute flex items-center gap-2 -translate-y-1/2 right-1 top-1/2">
							<PopoverColorPicker
								color={background || ''}
								onChange={setBackground}
							/>
						</div>
						<Button type="button" onClick={resetBackground} size="md">
							<FiRotateCcw className="w-4 h-4" />
						</Button>
					</div>
				</div>

				<div>
					<label className={'block text-sm  font-medium mb-1.5 text-content'}>
						رنگ متن (اختیاری)
					</label>
					<div className="relative flex flex-1">
						<TextInput
							type="text"
							value={textColor || ''}
							onChange={setTextColor}
							className="w-full px-3 py-2 pr-10 pl-24 !rounded-md"
							placeholder="#000000"
							debounce={true}
						/>
						<div className="absolute flex items-center gap-2 -translate-y-1/2 right-1 top-1/2">
							<PopoverColorPicker
								color={textColor || ''}
								onChange={setTextColor}
							/>
						</div>
						<Button type="button" onClick={resetTextColor} size="md">
							<FiRotateCcw className="w-4 h-4" />
						</Button>
					</div>
				</div>

				<div className="relative" ref={emojiPopoverRef}>
					<label className={'block text-sm font-medium mb-1.5 text-content'}>
						انتخاب استیکر (اختیاری)
					</label>

					<div className="flex items-center gap-2 mt-1">
						<Button
							size="md"
							type="button"
							onClick={toggleEmojiPopover}
							className={
								'btn !w-fit px-8 border-none shadow-none bg-base-300 text-muted rounded-xl transition-colors duration-300 ease-in-out'
							}
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
									'px-3 py-1.5 cursor-pointer text-xs rounded-md text-red-600 hover:bg-red-50'
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
								'absolute mt-1 p-2 w-64 max-h-32 overflow-y-auto small-scrollbar rounded-xl backdrop-blur-lg border border-content'
							}
							style={{ zIndex: 1000 }}
						>
							{renderEmojiGrid()}
						</div>
					)}
				</div>

				<div className="pt-2 space-y-2">
					<label className={'block text-sm font-medium text-content'}>
						پیش‌نمایش:
					</label>
					<div
						className="flex justify-center p-4 overflow-hidden rounded-lg"
						style={{
							backgroundImage: document.body.style.backgroundImage,
							backgroundColor: document.body.style.backgroundColor,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						<div className="w-28">
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
						className={
							'btn btn-circle !bg-base-300 hover:!bg-error/10 text-muted hover:!text-error px-10 border-none shadow-none !rounded-2xl transition-colors duration-300 ease-in-out'
						}
					>
						لغو
					</Button>
					<Button
						type="submit"
						onClick={() => handleClose()}
						size="md"
						isPrimary={true}
						className={
							'btn btn-circle !w-fit px-8 border-none shadow-none text-secondary !rounded-2xl transition-colors duration-300 ease-in-out'
						}
					>
						ذخیره
					</Button>
				</div>
			</div>
		</Modal>
	)
}
