import { FiFolder } from 'react-icons/fi'

interface CategoryFolderProps {
	id: string
	name: string
	previewImages: any[]
	onSelect: (categoryId: string) => void
}

export function CategoryFolder({
	id,
	name,
	previewImages,
	onSelect,
}: CategoryFolderProps) {
	return (
		<div
			onClick={() => onSelect(id)}
			className="flex flex-col h-32 p-3 transition-all border rounded-lg cursor-pointer bg-content border-content max-h-32 hover:border-primary/20"
		>
			<div className="flex items-center gap-2 mb-2">
				<FiFolder className="text-blue-500" size={18} />
				<p className="font-medium truncate text-muted">{name}</p>
			</div>

			<div className="flex-grow">
				{previewImages?.length > 0 ? (
					<div className="grid grid-cols-2 gap-1">
						{previewImages.slice(0, 4).map((image) => (
							<div
								key={image.id}
								className="overflow-hidden rounded aspect-video"
							>
								<img
									src={image.previewSrc}
									alt={image.name}
									className="object-cover w-full h-full"
									loading="lazy"
								/>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full rounded">
						<FiFolder className="mb-2 text-content/40" size={32} />
						<p className="text-xs text-gray-400">بدون تصویر</p>
					</div>
				)}
			</div>
		</div>
	)
}
