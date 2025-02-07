import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, lazy, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'

const FormSelect = lazy(() => import('./src/formSelect'))
const ControlledSelect = lazy(() => import('./src/controlledSelect'))

export default forwardRef((props: Props, ref) => {
	const selectRef = useRef<any>(null)
	useImperativeHandle(
		ref,
		() => ({
			async select() {
				selectRef.current?.select()
			},
			resetSelected() {
				selectRef.current?.resetSelected()
			},
		}),
		[]
	)

	const p = { ...getCompProps(props) } as Props

	return props.useScope ? (
		<FormSelect {...p} {...p.customProps} ref={selectRef} />
	) : (
		<ControlledSelect {...p} {...p.customProps} ref={selectRef} />
	)
})
