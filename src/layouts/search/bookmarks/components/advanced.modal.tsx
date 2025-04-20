import { getFaviconFromUrl } from '@/common/utils/icon'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useTheme } from '@/context/theme.context'
import { getEmojiList } from '@/services/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { RequireAuth } from '../../../../components/auth/require-auth'
import type { Bookmark } from '../types/bookmark.types'
import { BookmarkItem } from './bookmark-item'

interface AdvancedModalProps {
	title: string
	onClose: (
		data: { background?: string; textColor?: string; sticker?: string } | null,
	) => void
	isOpen: boolean
	bookmark: {
		type: Bookmark['type']
		customBackground: string
		customTextColor: string
		title?: string
		url?: string
		sticker?: string
	}
}

export function AdvancedModal({ title, onClose, isOpen, bookmark }: AdvancedModalProps) {
	if (!isOpen) return null
	const { theme, themeUtils } = useTheme()
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
		[sticker],
	)

	const toggleEmojiPopover = () => {
		setIsEmojiPopoverOpen((prev) => !prev)
	}

	const getButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
			case 'dark':
				return 'bg-neutral-700 hover:bg-neutral-600 text-neutral-200 border border-neutral-600'
			default: // glass
				return 'bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10'
		}
	}

	const getPopoverStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white shadow-lg border border-gray-200'
			case 'dark':
				return 'bg-neutral-800 shadow-lg border border-neutral-700'
			default: // glass
				return 'bg-[#1E1E1E]/90 backdrop-blur-sm shadow-lg border border-white/10'
		}
	}

	const renderEmojiGrid = () => {
		if (isLoadingEmojis) {
			return (
				<div className="flex items-center justify-center w-full p-4">
					<div className="w-5 h-5 border-2 rounded-full border-t-blue-500 border-blue-500/30 animate-spin"></div>
				</div>
			)
		}

		return (
			<div className="grid grid-cols-6 gap-2">
				{emojiUrls.map((url) => (
					<button
						key={url}
						onClick={() => handleEmojiSelect(url)}
						className={`flex items-center justify-center w-8 h-8 cursor-pointer rounded-md 
							${
								sticker === url
									? 'bg-blue-500/20 border-2 border-blue-500'
									: 'border border-gray-500/20 hover:bg-gray-500/10'
							}`}
					>
						<img
							src={url}
							alt="emoji"
							className="object-contain w-4 h-4"
							onError={(e) => {
								;(e.target as HTMLImageElement).style.display = 'none'
							}}
						/>
					</button>
				))}
			</div>
		)
	}

	function handleClose() {
		const hasBackgroundChanged = background !== bookmark.customBackground
		const hasTextColorChanged = textColor !== bookmark.customTextColor
		const hasEmojiChanged = sticker !== bookmark.sticker

		if (!hasBackgroundChanged && !hasTextColorChanged && !hasEmojiChanged) {
			onClose(null)
			return
		}

		onClose({
			background: hasBackgroundChanged ? background : undefined,
			textColor: hasTextColorChanged ? textColor : undefined,
			sticker: hasEmojiChanged ? sticker : undefined,
		})
	}

	function handleCancel() {
		onClose(null)
	}

	return (
		<Modal
			title={title}
			isOpen={isOpen}
			onClose={handleCancel}
			direction="rtl"
			closeOnBackdropClick={false}
			lockBodyScroll={false}
		>
			<div
				className={`flex flex-col p-2 gap-2 rounded-lg border ${themeUtils.getBorderColor()}`}
			>
				<RequireAuth mode="preview">
					<div>
						<label
							className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
						>
							رنگ پس زمینه (اختیاری)
						</label>
						<div className="flex items-center gap-2">
							<TextInput
								type="color"
								value={background}
								onChange={setBackground}
								className="!w-10 !h-10 cursor-pointer"
								debounce={true}
							/>
							<TextInput
								type="text"
								value={background}
								onChange={setBackground}
								className="flex-1 px-3 py-2rounded-md"
								placeholder="#000000"
								debounce={true}
							/>
						</div>
					</div>

					<div>
						<label
							className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
						>
							رنگ متن (اختیاری)
						</label>
						<div className="flex items-center gap-2">
							<TextInput
								type="color"
								value={textColor}
								onChange={setTextColor}
								className="!w-10 !h-10 cursor-pointer"
								debounce={true}
							/>
							<TextInput
								type="text"
								value={textColor}
								onChange={setTextColor}
								className="flex-1 px-3 py-2rounded-md"
								placeholder="#000000"
								debounce={true}
							/>
						</div>
					</div>
				</RequireAuth>

				<div className="relative" ref={emojiPopoverRef}>
					<label
						className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
					>
						انتخاب ایموجی (اختیاری)
					</label>

					<div className="flex items-center gap-2 mt-1">
						<button
							type="button"
							onClick={toggleEmojiPopover}
							className={`flex items-center justify-center h-10 px-3 rounded-md ${getButtonStyle()}`}
						>
							{sticker ? (
								<>
									{sticker.startsWith('http') ? (
										<img src={sticker} alt="selected emoji" className="w-6 h-6 ml-1" />
									) : (
										<span
											className="ml-1 text-lg"
											style={{
												fontFamily: "'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
											}}
										>
											{sticker}
										</span>
									)}
									<span className="text-xs">تغییر ایموجی</span>
								</>
							) : (
								<span className="text-xs">انتخاب ایموجی</span>
							)}
						</button>

						{sticker && (
							<button
								type="button"
								onClick={() => handleEmojiSelect(sticker)}
								className="p-2 text-xs text-red-400 hover:text-red-300"
							>
								حذف
							</button>
						)}
					</div>

					{/* Emoji Popover */}
					{isEmojiPopoverOpen && (
						<div
							className={`absolute z-50 mt-1 p-2 rounded-md w-64 ${getPopoverStyle()}`}
						>
							{renderEmojiGrid()}
						</div>
					)}
				</div>

				<div className="pt-2 space-y-2">
					<label
						className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
					>
						پیش‌نمایش:
					</label>
					<div
						className="flex justify-center p-4 overflow-hidden rounded-lg"
						style={{
							backgroundImage: document.body.style.backgroundImage,
							backgroundColor: document.body.style.backgroundColor || undefined,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
					>
						<BookmarkItem
							bookmark={{
								customBackground: background || undefined,
								customTextColor: textColor || undefined,
								sticker: sticker || undefined,
								icon: getFaviconFromUrl(bookmark.url || 'google.com'),
								title: bookmark.title || 'پیش‌نمایش',
								url: 'https://www.google.com',
								id: 'preview',
								isLocal: false,
								onlineId: null,
								parentId: null,
								type: bookmark.type,
							}}
							theme={theme}
							canAdd={false}
							onClick={() => {}}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-2 mt-4">
					<button
						onClick={handleCancel}
						className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
					>
						انصراف
					</button>
					<button
						onClick={handleClose}
						className="px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
					>
						ذخیره
					</button>
				</div>
			</div>
		</Modal>
	)
}
