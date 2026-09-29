import { defaultIcons } from './packs/default'

import type { IconBaseProps } from 'react-icons'
import { cn } from '@/common/utils/cn'
import type { IconName, IconSize } from './types'

interface Props extends Omit<IconBaseProps, 'size'> {
	name: IconName
	size?: IconSize
	spin?: boolean
}

export function Icon({ name, spin, className, ...props }: Props) {
	const Component = defaultIcons[name]

	return (
		<Component
			aria-hidden={props['aria-label'] || props.title ? undefined : true}
			className={cn(className, spin && 'animate-spin')}
			{...props}
		/>
	)
}
