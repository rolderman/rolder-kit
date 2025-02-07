/* Функция сравнивает объект.
Если в объекте есть функции на первом уровне, они так же буду проверены.
Глубже сравнение функций работать не будет и будет возвращаться false. */

import map from 'just-map-object'
import isEqual from 'lodash.isequal'
import isFunction from 'lodash.isfunction'

export default function (source: any, traget: any): boolean {
	const parsedSource: any = {}
	map(source, (key, value) => {
		if (isFunction(value)) parsedSource[key] = value.toString()
		else parsedSource[key] = value
	})

	const parsedTraget: any = {}
	map(traget, (key, value) => {
		if (isFunction(value)) parsedTraget[key] = value.toString()
		else parsedTraget[key] = value
	})

	return isEqual(parsedSource, parsedTraget)
}
