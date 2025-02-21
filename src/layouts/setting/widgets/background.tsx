import { Checkbox, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { Colors } from '../../../common/constant/colors.constant'

interface Background {
	id: string
	name: string
	imageUrl: string
}

export function BackgroundSetting() {
	const [selectedBackground, setSelectedBackground] = useState<string>('7')
	const [isRetouchEnabled, setIsRetouchEnabled] = useState<boolean>(false)

	const backgrounds: Background[] = [
		{
			id: '1',
			name: 'تهران',
			imageUrl:
				'https://plus.unsplash.com/premium_photo-1697729881988-9174c283d417?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: '2',
			name: 'طبیعت',
			imageUrl:
				'https://plus.unsplash.com/premium_photo-1697730206215-d1dcaa5917d7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: '3',
			name: 'شهر',
			imageUrl:
				'https://plus.unsplash.com/premium_photo-1661963282607-4c4a07f4266b?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: '4',
			name: 'Space',
			imageUrl:
				'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: '5',
			name: 'earth',
			imageUrl:
				'https://images.unsplash.com/photo-1643330683233-ff2ac89b002c?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{
			id: '6',
			name: 'تهران 2',
			imageUrl:
				'https://images.unsplash.com/photo-1593371514631-b8967f504a54?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		},
		{ id: '7', name: 'تهران 3', imageUrl: 'https://i.postimg.cc/YSRJ4Lf3/back.jpg' },
	]

	useEffect(() => {
		const selectedBg = backgrounds.find((bg) => bg.id === selectedBackground)
		if (selectedBg) {
			const gradient = isRetouchEnabled
				? 'linear-gradient(rgb(53 53 53 / 42%), rgb(0 0 0 / 16%)), '
				: ''
			document.body.style.backgroundImage = `${gradient}url(${selectedBg.imageUrl})`
		}
	}, [selectedBackground, isRetouchEnabled])

	const handleBackgroundSelect = (id: string) => setSelectedBackground(id)

	const handleRetouchToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsRetouchEnabled(e.target.checked)
	}

	return (
		<div className="w-full max-w-xl mx-auto">
			<div>
				<h2 className="mb-4 text-xl font-semibold text-gray-300">تصویر زمینه</h2>
				<div className="flex flex-row h-40 gap-4 px-2 overflow-x-auto">
					{backgrounds.map((background) => (
						<div
							key={background.id}
							className={`relative w-32 mt-2 h-32 flex-shrink-0  cursor-pointer rounded overflow-hidden transition-transform transform hover:scale-105 ${
								selectedBackground === background.id ? 'ring-2 ring-blue-500' : ''
							}`}
							onClick={() => handleBackgroundSelect(background.id)}
							aria-label={`Select background ${background.name}`}
						>
							<img
								src={background.imageUrl}
								alt={background.name}
								className="object-cover w-full h-full"
							/>
							<div
								className={`absolute bottom-0 left-0 right-0 p-2 text-white ${Colors.bgItemGlass}`}
							>
								<p className="text-sm text-center font-[Vazir]">{background.name}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="mt-6">
				<Checkbox
					label={
						<div>
							<Typography
								color="blue-gray"
								className="font-medium font-[Vazir] text-gray-300"
							>
								فیلتر تصویر
							</Typography>
							<Typography
								variant="small"
								color="gray"
								className="font-light font-[Vazir] text-gray-400"
							>
								با فعال کردن این گزینه تصویر زمینه شما تاریک تر خواهد شد
							</Typography>
						</div>
					}
					color="blue"
					checked={isRetouchEnabled}
					onChange={handleRetouchToggle}
					containerProps={{
						className: '-mt-5',
					}}
				/>
			</div>
		</div>
	)
}
