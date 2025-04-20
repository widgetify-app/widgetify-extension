import { getFaviconFromUrl } from '@/common/utils/icon'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { getButtonStyles, useTheme } from '@/context/theme.context'
import { getEmojiList } from '@/services/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FiRotateCcw } from 'react-icons/fi'
import { RequireAuth } from '../../../../components/auth/require-auth'
import type { Bookmark } from '../types/bookmark.types'
import { BookmarkItem } from './bookmark-item'
import PopoverColorPicker from './PopoverColorPicker'

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

	const getResetButtonStyle = () => {
		return `${themeUtils.getButtonStyles()} cursor-pointer absolute left-1 top-1/2 -translate-y-1/2 rounded-full`
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

	const resetBackground = () => {
		setBackground('')
	}

	const resetTextColor = () => {
		setTextColor('')
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

	return (
		<Modal
			title={title}
			isOpen={isOpen}
			onClose={() => onClose(null)}
			direction="rtl"
			closeOnBackdropClick={false}
			lockBodyScroll={false}
		>
			<div className={'flex flex-col p-2 gap-2 rounded-lg'}>
				<RequireAuth mode="preview">
					<div>
						<label
							className={`block text-sm font-medium mb-1.5 ${themeUtils.getTextColor()}`}
						>
							رنگ پس زمینه (اختیاری)
						</label>
						<div className="relative flex flex-1">
							<TextInput
								type="text"
								value={background}
								onChange={setBackground}
								className="w-full px-3 py-2 pr-10 pl-24 !rounded-md"
								placeholder="#000000"
								debounce={true}
							/>
							<div className="absolute -translate-y-1/2 right-1 top-1/2 flex items-center gap-2">
								<PopoverColorPicker color={background} onChange={setBackground} />
							</div>
							<button
								type="button"
								onClick={resetBackground}
								className={getResetButtonStyle()}
							>
								<FiRotateCcw className="w-4 h-4" />
							</button>
						</div>
					</div>

					<div>
						<label
							className={`block text-sm  font-medium mb-1.5 ${themeUtils.getTextColor()}`}
						>
							رنگ متن (اختیاری)
						</label>
						<div className="relative flex flex-1">
							<TextInput
								type="text"
								value={textColor}
								onChange={setTextColor}
								className="w-full px-3 py-2 pr-10 pl-24 !rounded-md"
								placeholder="#000000"
								debounce={true}
							/>
							<div className="absolute -translate-y-1/2 right-1 top-1/2 flex items-center gap-2">
								<PopoverColorPicker color={textColor} onChange={setTextColor} />
							</div>
							<button
								type="button"
								onClick={resetTextColor}
								className={getResetButtonStyle()}
							>
								<FiRotateCcw className="w-4 h-4" />
							</button>
						</div>
					</div>
				</RequireAuth>

				<div className="relative" ref={emojiPopoverRef}>
					<label
						className={`block text-sm font-medium mb-1.5 ${themeUtils.getTextColor()}`}
					>
						انتخاب ایموجی (اختیاری)
					</label>

					<div className="flex items-center gap-2 mt-1">
						<button
							type="button"
							onClick={toggleEmojiPopover}
							className={`flex items-center justify-center h-10 px-4 rounded-md transition-colors ${themeUtils.getButtonStyles()} cursor-pointer`}
						>
							{sticker ? (
								<>
									{sticker.startsWith('http') ? (
										<img src={sticker} alt="selected emoji" className="w-6 h-6 ml-2" />
									) : (
										<span
											className="ml-2 text-lg"
											style={{
												fontFamily: "'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
											}}
										>
											{sticker}
										</span>
									)}
									<span className="text-xs font-medium">تغییر ایموجی</span>
								</>
							) : (
								<span className="text-xs font-medium">انتخاب ایموجی</span>
							)}
						</button>

						{sticker && (
							<button
								type="button"
								onClick={() => handleEmojiSelect(sticker)}
								className={`px-3 py-1.5 cursor-pointer text-xs rounded-md ${theme === 'light' ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-900/20'}`}
							>
								حذف
							</button>
						)}
					</div>

					{/* Emoji Popover */}
					{isEmojiPopoverOpen && (
						<div
							className={`absolute z-50 mt-1 p-2 rounded-md w-64 max-h-32 overflow-y-auto small-scrollbar ${getPopoverStyle()}`}
						>
							{renderEmojiGrid()}
						</div>
					)}
				</div>

				<div className="pt-2 space-y-2">
					<label className={`block text-sm font-medium ${themeUtils.getTextColor()}`}>
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
						onClick={() => onClose(null)}
						className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${getButtonStyles(theme, false)}`}
					>
						انصراف
					</button>
					<button
						onClick={handleClose}
						className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${getButtonStyles(theme, true)}`}
					>
						ذخیره
					</button>
				</div>
			</div>
		</Modal>
	)
}
