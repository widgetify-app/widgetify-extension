import { useState } from 'react'
import type { WidgetDefinition } from '@/features/widgets/utils/layout-engine/types'
import { Icon, type IconSize } from '@/icons'

interface WidgetIconProps {
	definition: Pick<WidgetDefinition, 'id' | 'icon' | 'iconUrl' | 'emoji'>
	size: IconSize
}

function isPartner(id: string): boolean {
	return id.startsWith('widget:')
}

export function WidgetIcon({ definition, size }: WidgetIconProps) {
	const [failedUrl, setFailedUrl] = useState<string | null>(null)
	const { iconUrl } = definition

	if (iconUrl && iconUrl !== failedUrl) {
		return (
			<img
				src={iconUrl}
				alt=""
				width={size}
				height={size}
				loading="lazy"
				decoding="async"
				referrerPolicy="no-referrer"
				draggable={false}
				onError={() => setFailedUrl(iconUrl)}
				className="object-contain rounded-lg"
				style={{ width: size, height: size }}
			/>
		)
	}

	if (isPartner(definition.id) && definition.emoji) {
		return (
			<span
				aria-hidden="true"
				className="leading-none"
				style={{ fontSize: size * 0.9 }}
			>
				{definition.emoji}
			</span>
		)
	}

	return <Icon name={definition.icon} size={size} />
}
