import { GridProps } from '@mantine/core'
import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    gridColumnsScheme: { [prop: strin]: any }[]
    gridColumnsCount: number
    gridJustify: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
    gridAlign: 'stretch' | 'center' | 'flex-start' | 'flex-end'
    childIsRepeater?: boolean
}