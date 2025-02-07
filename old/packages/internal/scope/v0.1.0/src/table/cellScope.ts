import { createScope, molecule } from 'bunshi'
import { useMolecule } from 'bunshi/react'
import { atom } from 'nanostores'
import type { Item } from 'types'

export const TableCellScope = createScope<unknown>(undefined)
export const TableCellMolecule = molecule((_, scope) => {
	scope(TableCellScope)
	return atom<Item | undefined>()
})

export function useTableCellScope() {
	const tableCellMol = useMolecule(TableCellMolecule)
	return tableCellMol.get()
}
