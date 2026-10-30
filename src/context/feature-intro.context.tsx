import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { addSeenIntro, normalizeSeenIntros } from './utils/feature-intros'

export const FEATURE_INTRO_IDS = {
	bookmarkGroupOpen: 'bookmark-group-open',
} as const

type FeatureIntroId = (typeof FEATURE_INTRO_IDS)[keyof typeof FEATURE_INTRO_IDS]

interface FeatureIntroStore {
	load: () => Promise<string[]>
	save: (seen: string[]) => Promise<void>
}

const deviceStore: FeatureIntroStore = {
	load: async () => normalizeSeenIntros(await getFromStorage('seenFeatureIntros')),
	save: (seen) => setToStorage('seenFeatureIntros', seen),
}

interface FeatureIntroContextValue {
	seen: string[] | null
	markSeen: (id: FeatureIntroId) => void
}

const FeatureIntroContext = createContext<FeatureIntroContextValue | null>(null)

export function FeatureIntroProvider({ children }: { children: ReactNode }) {
	const [seen, setSeen] = useState<string[] | null>(null)

	useEffect(() => {
		let cancelled = false
		deviceStore.load().then((ids) => {
			if (!cancelled) setSeen(ids)
		})
		return () => {
			cancelled = true
		}
	}, [])

	const markSeen = useCallback((id: FeatureIntroId) => {
		setSeen((prev) => {
			const next = addSeenIntro(prev ?? [], id)
			if (next !== prev) deviceStore.save(next)
			return next
		})
	}, [])

	const value = useMemo(() => ({ seen, markSeen }), [seen, markSeen])

	return (
		<FeatureIntroContext.Provider value={value}>
			{children}
		</FeatureIntroContext.Provider>
	)
}

export function useFeatureIntro(id: FeatureIntroId) {
	const context = useContext(FeatureIntroContext)
	if (!context)
		throw new Error('useFeatureIntro must be used within FeatureIntroProvider')

	const { seen, markSeen } = context
	const isUnseen = seen !== null && !seen.includes(id)

	const dismiss = useCallback(() => {
		Analytics.event('feature_intro_dismissed', { id })
		markSeen(id)
	}, [id, markSeen])

	return { isUnseen, dismiss }
}
