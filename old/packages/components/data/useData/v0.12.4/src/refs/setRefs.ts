import type { Item } from 'types'

export function setRefs(items: Item[], refDbClass: string, refItems: Item[]) {
	return items.map((item: any) => {
		if (Array.isArray(item[refDbClass])) {
			const refItemsArr = refItems.filter((i) => item[refDbClass]?.map((i: any) => i.id).includes(i.id))
			if (refItemsArr?.length && !item[refDbClass]._kuzzle_info) item[refDbClass] = refItemsArr.map((i) => new Proxy(i, {}))
		} else {
			const refItem = refItems.find((i: any) => item[refDbClass]?.id === i.id)
			if (refItem) item[refDbClass] = new Proxy(refItem, {})
		}
		return item
	})
}

export function setBackRefs(dbClass: string, items: Item[], refDbClass: string, refItems: Item[]) {
	return items.map((item: any) => {
		//@ts-ignore
		const refItemsArr = refItems.filter((i) => item.id === i[dbClass]?.id)
		if (refItemsArr?.length) item[refDbClass] = refItemsArr.map((i) => new Proxy(i, {}))
		return item
	})
}
