import { createScope, molecule } from "bunshi";
import { atom } from "nanostores";

export const TableCellScope010 = createScope<unknown>(undefined);
export const TableCellMolecule010 = molecule((_, scope) => {
    scope(TableCellScope010)
    const item = atom<RItem | undefined>()
    return { item }
})