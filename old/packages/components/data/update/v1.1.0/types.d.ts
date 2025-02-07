import type { BaseJsProps } from '@packages/node'
import type { Item } from 'types'

export type Props = BaseJsProps & {
	scheme: UpdateScheme
	optimistic?: boolean
}

export type UpdateScheme = {
	dbClass: string
	items?: Item[]
	itemsFunc?: string
	silent?: boolean
	offlineSilent?: boolean
}[]
