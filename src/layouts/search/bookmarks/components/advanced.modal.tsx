import { getFaviconFromUrl } from '@/common/utils/icon'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useTheme } from '@/context/theme.context'
import { getEmojiList } from '@/services/api'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import type { Bookmark } from '../types/bookmark.types'
import { BookmarkItem } from './bookmark-item'

interface AdvancedModalProps {
	title: string
	onClose: () => void
	isOpen: boolean
	bookmark: {
		type: Bookmark['type']
		customBackground: string
		customTextColor: string
		title?: string
		url?: string
		emoji?: string
	}
	setCustomBackground: (value: string) => void
	setCustomTextColor: (value: string) => void
	setEmoji?: (value: string) => void
}

export function AdvancedModal({
	title,
	onClose,
	isOpen,
	bookmark,
	setCustomBackground,
	setCustomTextColor,
	setEmoji = () => {},
}: AdvancedModalProps) {
	if (!isOpen) return null
	const { theme, themeUtils } = useTheme()
	const emojiPopoverRef = useRef<HTMLDivElement>(null)
	const [isPending, startTransition] = useTransition()

	const [formData, setFormData] = useState({
		background: bookmark.customBackground,
		textColor: bookmark.customTextColor,
		emoji: bookmark.emoji || '',
	})

	const [isEmojiPopoverOpen, setIsEmojiPopoverOpen] = useState(false)
	const [emojiUrls, setEmojiUrls] = useState<string[]>([])
	const [isLoadingEmojis, setIsLoadingEmojis] = useState(false)

	const updateFormData = useCallback((key: string, value: string) => {
		setFormData((prev) => ({ ...prev, [key]: value }))
	}, [])

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
		setFormData({
			background: bookmark.customBackground,
			textColor: bookmark.customTextColor,
			emoji: bookmark.emoji || '',
		})
	}, [bookmark.customBackground, bookmark.customTextColor, bookmark.emoji])

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

	const updateBackground = useCallback(
		(value: string) => {
			updateFormData('background', value)
			setCustomBackground(value)
		},
		[setCustomBackground, updateFormData],
	)

	const updateTextColor = useCallback(
		(value: string) => {
			updateFormData('textColor', value)
			setCustomTextColor(value)
		},
		[setCustomTextColor, updateFormData],
	)

	const handleEmojiSelect = useCallback(
		(emoji: string) => {
			const newEmoji = formData.emoji === emoji ? '' : emoji
			updateFormData('emoji', newEmoji)
			setEmoji(newEmoji)
			setIsEmojiPopoverOpen(false)
		},
		[formData.emoji, setEmoji, updateFormData],
	)

	const handleSave = useCallback(() => {
		startTransition(() => {
			onClose()
		})
	}, [onClose])

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
								formData.emoji === url
									? 'bg-blue-500/20 border-2 border-blue-500'
									: 'border border-gray-500/20 hover:bg-gray-500/10'
							}`}
					>
						<img
							src={url}
							alt="emoji"
							className="object-contain w-4 h-4"
							onError={(e) => {
								// If image fails to load, hide it
								;(e.target as HTMLImageElement).style.display = 'none'
							}}
						/>
					</button>
				))}
			</div>
		)
	}

	return (
		<Modal
			title={title}
			isOpen={isOpen}
			onClose={onClose}
			direction="rtl"
			closeOnBackdropClick={false}
			lockBodyScroll={false}
		>
			<form
				className={`flex flex-col p-2 gap-2 rounded-lg border ${themeUtils.getBorderColor()}`}
				onSubmit={(e) => {
					e.preventDefault()
					handleSave()
				}}
			>
				<div>
					<label
						className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
					>
						رنگ پس زمینه (اختیاری)
					</label>
					<div className="flex items-center gap-2">
						<TextInput
							type="color"
							value={formData.background}
							onChange={updateBackground}
							className="!w-10 !h-10 cursor-pointer"
							debounce={true}
						/>
						<TextInput
							type="text"
							value={formData.background}
							onChange={updateBackground}
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
							value={formData.textColor}
							onChange={updateTextColor}
							className="!w-10 !h-10 cursor-pointer"
							debounce={true}
						/>
						<TextInput
							type="text"
							value={formData.textColor}
							onChange={updateTextColor}
							className="flex-1 px-3 py-2rounded-md"
							placeholder="#000000"
							debounce={true}
						/>
					</div>
				</div>

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
							{formData.emoji ? (
								<>
									{formData.emoji.startsWith('http') ? (
										<img
											src={formData.emoji}
											alt="selected emoji"
											className="w-6 h-6 ml-1"
										/>
									) : (
										<span
											className="ml-1 text-lg"
											style={{
												fontFamily: "'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
											}}
										>
											{formData.emoji}
										</span>
									)}
									<span className="text-xs">تغییر ایموجی</span>
								</>
							) : (
								<span className="text-xs">انتخاب ایموجی</span>
							)}
						</button>

						{formData.emoji && (
							<button
								type="button"
								onClick={() => handleEmojiSelect(formData.emoji)}
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
					<div className="flex justify-center">
						<BookmarkItem
							bookmark={{
								customBackground: formData.background || undefined,
								customTextColor: formData.textColor || undefined,
								emoji: formData.emoji || undefined,
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

				<div className="flex justify-end mt-4">
					<button
						type="submit"
						className={
							'px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer'
						}
						disabled={isPending}
					>
						{isPending ? 'درحال ذخیره...' : 'ذخیره'}
					</button>
				</div>
			</form>
		</Modal>
	)
}
