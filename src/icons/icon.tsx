import { defaultIcons } from './packs/default'

import type { IconBaseProps } from 'react-icons'
import { cn } from '@/common/utils/cn'
import type { IconName } from './types'
import { useIconPack } from './icons.context'

const packs = {
	default: defaultIcons,
}

interface Props extends IconBaseProps {
	name: IconName
	spin?: boolean
}

export function Icon({ name, spin, className, ...props }: Props) {
	const { pack } = useIconPack()

	const Component = packs[pack][name] ?? defaultIcons[name]

	if (!Component) return null

	return <Component className={cn(className, spin && 'animate-spin')} {...props} />
}
