import { Skeleton } from '@mantine/core'
import { memo, useContext } from 'react'
import { useStore } from 'zustand'
import setTemplateCell from '../funcs/setTemplateCell'
import { TableContext } from '../store/store'

export default memo((p: { rowId: string; columnIdx: number }) => {
	const store = useContext(TableContext)
	if (!store) return

	// Состояние готовности кастномных ячеек строки и/или разворачиваемой строки.
	const ready = useStore(store, (s) => s.rows.get(p.rowId)?.ready)

	console.log('TemplateCell render', p.rowId) // Считаем рендеры пока разрабатываем

	// Вытягиваем ранее подотовленное кастомные ячейки, не подписываясь. Делается это раз, потом здесь нет рендеров.
	// loading для верной отрисковки скелетона.
	//if (!ready) setTemplateCell(store, store.getState().columns[p.columnIdx], store.getState().rows.get(p.rowId) as any);

	return (
		<Skeleton visible={!ready}>{store.getState().rows.get(p.rowId)?.templateCells.get(p.columnIdx) || 'loading...'}</Skeleton>
	)
})
