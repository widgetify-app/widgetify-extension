import { auth } from './auth'
import { city } from './city'
import { common } from './common'
import { context } from './context'
import { error } from './error'
import { explorer } from './explorer'
import { friends } from './friends'
import { gallery } from './gallery'
import { home } from './home'
import { market } from './market'
import { miniApps } from './mini-apps'
import { mood } from './mood'
import { navbar } from './navbar'
import { news } from './news'
import { releaseNotes } from './release-notes'
import { setting } from './setting'
import { ui } from './ui'
import { widgets } from './widgets'

export const fa = {
	...auth,
	...city,
	...common,
	...context,
	...error,
	...explorer,
	...friends,
	...gallery,
	...home,
	...market,
	...miniApps,
	...mood,
	...navbar,
	...news,
	...releaseNotes,
	...setting,
	...ui,
	...widgets,
} as const
