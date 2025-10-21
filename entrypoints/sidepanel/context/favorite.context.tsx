import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { getFromStorage, setToStorage } from '@/common/storage'
import type { FavoriteSite } from '../layouts/favorite/favorite.types'

export interface FavoriteStoreContext {
	favorites: FavoriteSite[]
	addFavorite: (site: FavoriteSite) => void
	removeFavorite: (url: string) => void
	isFavorite: (url: string) => boolean
}

const favoriteContext = createContext<FavoriteStoreContext>({
	favorites: [],
	addFavorite: () => {},
	removeFavorite: () => {},
	isFavorite: () => false,
})

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [favorites, setFavorites] = useState<FavoriteSite[]>([])
	const initRef = React.useRef(false)

	useEffect(() => {
		const loadFavorites = async () => {
			const storedFavorites = await getFromStorage('favoriteSites')
			if (Array.isArray(storedFavorites) && storedFavorites.length > 0) {
				setFavorites(storedFavorites)
			}

			initRef.current = true
		}

		loadFavorites()
	}, [])

	useEffect(() => {
		const saveFavorites = async (data: FavoriteSite[]) => {
			if (initRef.current) {
				await setToStorage('favoriteSites', data)
				console.log('Saved favorites to storage:', data)
			}
		}

		if (initRef.current) {
			saveFavorites(favorites)
		}
	}, [favorites])

	const addFavorite = (site: FavoriteSite) => {
		if (favorites.some((fav) => fav.url === site.url)) {
			toast.error('این سایت قبلاً به علاقه‌مندی‌ها اضافه شده است')
			return
		}

		if (favorites.length >= 8) {
			toast.error('حداکثر ۸ سایت می‌توانید اضافه کنید')
			return
		}

		const newFavorites = [...favorites, site]
		setFavorites(newFavorites)
		toast.success('سایت به علاقه‌مندی‌ها اضافه شد')
	}

	const removeFavorite = (url: string) => {
		const newFavorites = favorites.filter((fav) => fav.url !== url)
		setFavorites(newFavorites)
		toast.success('سایت از علاقه‌مندی‌ها حذف شد')
	}

	const isFavorite = (url: string) => {
		return favorites.some((fav) => fav.url === url)
	}

	return (
		<favoriteContext.Provider
			value={{
				favorites,
				addFavorite,
				removeFavorite,
				isFavorite,
			}}
		>
			{children}
		</favoriteContext.Provider>
	)
}

export function useFavoriteStore(): FavoriteStoreContext {
	const context = React.useContext(favoriteContext)
	if (!context) {
		throw new Error('useFavoriteStore must be used within a FavoriteProvider')
	}
	return context
}
