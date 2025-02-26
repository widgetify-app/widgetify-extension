import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Modal from '../../../components/modal'
import type { LocalBookmark } from '../../../context/bookmark.context'

interface AddBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (bookmark: LocalBookmark) => void
}

type IconSource = 'auto' | 'upload' | 'url'
const empty = { title: '', url: '', icon: '', id: '', isLocal: true, pinned: false }
export function AddBookmarkModal({ isOpen, onClose, onAdd }: AddBookmarkModalProps) {
	const [formData, setFormData] = useState<LocalBookmark>(empty)

	const [iconSource, setIconSource] = useState<IconSource>('auto')
	const [isUploading, setIsUploading] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const getFaviconFromUrl = (url: string) => {
		try {
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				url = `http://${url}`
			}
			const urlObj = new URL(url)
			return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
		} catch (er) {
			return ''
		}
	}

	const handleChange = (field: keyof LocalBookmark) => {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value

			setFormData((prev) => {
				if (field === 'url' && iconSource === 'auto') {
					return handleUrlFieldChange(prev, value)
				}

				return {
					...prev,
					[field]: value,
				}
			})
		}
	}

	const handleUrlFieldChange = (prev: LocalBookmark, value: string): LocalBookmark => {
		let icon = ''
		if (value) {
			try {
				const url = value.startsWith('http') ? value : `https://${value}`
				icon = `https://${new URL(url).host}/favicon.ico`
			} catch {}
		}

		return {
			...prev,
			url: value,
			icon,
		}
	}

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setIsUploading(true)
			//todo local file
			setTimeout(() => setIsUploading(false), 1000)
		}
	}

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const url = e.target.value
		setFormData((prev) => {
			return {
				...prev,
				url,
				icon: getFaviconFromUrl(url),
			}
		})
	}

	const handleAdd = () => {
		if (formData.title.trim() && formData.url.trim()) {
			onAdd({
				...formData,
				isLocal: true,
				pinned: false,
				id: uuidv4(),
			})
			setFormData(empty)
			setIconSource('auto')
			onClose()
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="sm"
			title="✨ بوکمارک جدید"
			direction="rtl"
		>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
				className="flex flex-col gap-4 p-4"
			>
				<motion.input
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.1 }}
					whileFocus={{ scale: 1.02 }}
					type="text"
					placeholder="عنوان باحال بوکمارکت"
					value={formData.title}
					onChange={handleChange('title')}
					className="w-full px-4 py-3 text-right text-white bg-[#1E1E1E] border border-[#333] rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
				/>

				<motion.input
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					whileFocus={{ scale: 1.02 }}
					type="text"
					placeholder="لینک وبسایت"
					value={formData.url}
					onChange={handleUrlChange}
					className="w-full px-4 py-3 text-right text-white bg-[#1E1E1E] border border-[#333] rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
				/>

				{formData.icon && (
					<div className="flex items-center gap-2 p-2 bg-[#1E1E1E] border border-[#333] rounded-lg">
						<img src={formData.icon} alt="favicon" className="w-6 h-6" />
						<span className="text-sm text-gray-400">پیش‌نمایش آیکون</span>
					</div>
				)}

				<motion.div
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="space-y-3"
				>
					<div className="flex items-center justify-end gap-3">
						<label className="text-sm text-gray-400">آیکون:</label>
						<div className="flex gap-2">
							<button
								onClick={() => setIconSource('auto')}
								className={`px-3 py-1 rounded-md text-sm transition-colors ${
									iconSource === 'auto'
										? 'bg-purple-600 text-white'
										: 'bg-[#1E1E1E] text-gray-400 hover:bg-[#2A2A2A]'
								}`}
							>
								خودکار
							</button>
							<button
								onClick={() => fileInputRef.current?.click()}
								className={`px-3 py-1 rounded-md text-sm transition-colors ${
									iconSource === 'upload'
										? 'bg-purple-600 text-white'
										: 'bg-[#1E1E1E] text-gray-400 hover:bg-[#2A2A2A]'
								}`}
							>
								آپلود
							</button>
							<button
								onClick={() => setIconSource('url')}
								className={`px-3 py-1 rounded-md text-sm transition-colors ${
									iconSource === 'url'
										? 'bg-purple-600 text-white'
										: 'bg-[#1E1E1E] text-gray-400 hover:bg-[#2A2A2A]'
								}`}
							>
								لینک
							</button>
						</div>
					</div>

					<AnimatePresence mode="wait">
						{iconSource === 'url' && (
							<motion.input
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								type="text"
								placeholder="لینک آیکون"
								value={formData.icon}
								onChange={handleChange('icon')}
								className="w-full px-4 py-3 text-right text-white bg-[#1E1E1E] border border-[#333] rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
							/>
						)}
					</AnimatePresence>

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileUpload}
						className="hidden"
					/>

					{iconSource === 'auto' && formData.url && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex items-center justify-end gap-2 text-sm text-gray-400"
						>
							<img
								src={`https://${new URL(formData.url.startsWith('http') ? formData.url : `https://${formData.url}`).host}/favicon.ico`}
								alt="favicon"
								className="w-4 h-4"
								// onError={(e) => {
								// 	e.currentTarget.src = '/default-favicon.ico'
								// }}
							/>
							آیکون به صورت خودکار از سایت دریافت می‌شود
						</motion.div>
					)}
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="flex items-center justify-between mt-2"
				>
					<button
						onClick={onClose}
						className="text-sm text-gray-500 transition-colors hover:text-gray-400"
					>
						بیخیال!
					</button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleAdd}
						className="px-6 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
					>
						✨ اضافه کن
					</motion.button>
				</motion.div>
			</motion.div>
		</Modal>
	)
}
