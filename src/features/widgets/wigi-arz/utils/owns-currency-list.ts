import { type StoredWidget, WidgetKeys } from '../../utils/layout-engine/types'

export function ownsCurrencyList(
	widget: Pick<StoredWidget, 'id' | 'size'> | null | undefined
): boolean {
	return widget?.id === WidgetKeys.arzLive && widget.size.w === 2 && widget.size.h === 3
}
