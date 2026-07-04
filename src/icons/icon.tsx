import { defaultIcons } from './packs/default'

import type { IconBaseProps } from 'react-icons'
import type { IconName } from './types'
import { useIconPack } from './icons.context'

const packs = {
	default: defaultIcons,
}

interface Props extends IconBaseProps {
	name: IconName
}

export function Icon({ name, ...props }: Props) {
	const { pack } = useIconPack()

	const Component = packs[pack][name] ?? defaultIcons[name]

	if (!Component) return null

	return <Component {...props} />
}
