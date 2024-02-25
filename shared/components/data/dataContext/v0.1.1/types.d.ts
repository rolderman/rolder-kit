import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {    
    
}

export type DataScheme = {
    dbClass: string
    filters?: Filters
    sorts?: Sorts
    size?: number
    refs?: string[]
    backRefs?: string[]
    searchAfter?: string[]
    getUsers?: boolean
    aggQuery?: Filters
}

type Filters = { [key: string]: any }
type Sorts = { [key: string]: 'asc' | 'desc' }[]