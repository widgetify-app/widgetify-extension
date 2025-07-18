import { getMainColorFromImage } from '@/common/color'
import { useEffect, useState } from 'react'

export const useGetImageMainColor = (
	imageSrc: string | undefined
): string | undefined => {
	const [imgMainColor, setImageMainColor] = useState<string>("00000000")

	useEffect(() => {
		imageSrc &&
			getMainColorFromImage(imageSrc).then((color) => {
				setImageMainColor(color)
			})
	}, [imageSrc])

	return imgMainColor
}
