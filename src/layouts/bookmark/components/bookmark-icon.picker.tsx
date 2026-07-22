import { showToast } from '@/common/toast'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { Icon } from '@/src/icons'
import type React from 'react'
import { useRef, useState } from 'react'

type Props = {
	value: File | string | null
	url?: string | null
	onChange: (file: File | null) => void
}

export function BookmarkIconPicker({ value, url, onChange }: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [error, setError] = useState(false)

	const openPicker = () => {
		fileInputRef.current?.click()
	}

	const handleFile = (file?: File) => {
		if (!file || !file.type.startsWith('image/'))
			return showToast('فرمت نامعتبر', 'error')
		onChange(file)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
		handleFile(e.dataTransfer.files?.[0])
	}

	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleFile(e.target.files?.[0])
	}

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation()
		onChange(null)
		setError(false)
	}

	const isFile = value instanceof File
	let iconSrc: string | null = null
	if (value && isFile) {
		iconSrc = URL.createObjectURL(value)
	} else {
		if (value) {
			iconSrc = value
		} else if (url && url !== 'null') {
			iconSrc = getFaviconFromUrl(url || '')
		}
	}

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				hidden
				accept="image/*"
				onChange={handleUpload}
			/>

			<div
				onClick={openPicker}
				onDragOver={(e) => {
					e.preventDefault()
					setIsDragging(true)
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				className={`relative w-12 h-10 flex items-center justify-center cursor-pointer border-2 rounded-xl transition
					${isDragging ? 'border-blue-400' : 'border-base-300'}
				`}
			>
				{iconSrc && !error ? (
					<img
						src={iconSrc}
						className={`w-full h-full object-contain p-2 ${
							isFile ? 'rounded-md' : 'rounded-xl'
						}`}
						onError={() => setError(true)}
					/>
				) : (
					<Icon name="image" />
				)}

				<div className="absolute inset-0 flex items-center justify-center transition opacity-0 hover:opacity-100">
					<Icon name="uploadImage" />
				</div>

				{isFile && (
					<button
						onClick={handleRemove}
						className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 rounded-full bg-base-300"
					>
						<Icon name="close" size={12} />
					</button>
				)}
			</div>
		</>
	)
}
