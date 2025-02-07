import { sendOutput, sendSignal } from '@packages/port-send'
import { Document, Font, pdf } from '@react-pdf/renderer'
import { createElement, forwardRef, useImperativeHandle } from 'react'
import type { Props } from './types'

const defaultFont = {
	family: 'Roboto',
	fonts: [
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf',
			fontWeight: 100,
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf',
			fontWeight: 100,
			fontStyle: 'italic',
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf',
			fontWeight: 300,
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf',
			fontWeight: 300,
			fontStyle: 'italic',
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
			fontWeight: 400,
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf',
			fontWeight: 400,
			fontStyle: 'italic',
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf',
			fontWeight: 500,
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf',
			fontWeight: 500,
			fontStyle: 'italic',
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
			fontWeight: 700,
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf',
			fontWeight: 700,
			fontStyle: 'italic',
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf',
			fontWeight: 900,
		},
		{
			src: 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf',
			fontWeight: 900,
			fontStyle: 'italic',
		},
	],
}

const PdfDocument = (props: Props) => {
	const ch = props.children as any
	const children = Array.isArray(ch)
		? ch.filter((i) => i.props.noodlNode.model.type.split('.')[1] === 'PdfPage')
		: ch?.props.noodlNode.model.type.split('.')[1] === 'PdfPage'
			? ch
			: undefined

	return (
		<Document {...props.customProps} style={props.style}>
			{children}
		</Document>
	)
}

export default forwardRef((props: Props, ref) => {
	const { noodlNode, fonts } = props

	Font.register(defaultFont)
	fonts?.map((font) => Font.register(font))

	useImperativeHandle(
		ref,
		() => ({
			async create() {
				sendOutput(noodlNode, 'creating', true)

				// Закоментил усложения, которые зачем то были нужны. Сейчас работает и без них, значит без 2-й генерации PDF.
				//const PDF = pdf(createElement(PdfDocument, props));
				// С переходом на React 18, это строка перестала работать. В Roodl, в react-component-node, срока 662 с пометкой Rolder правит это.
				const PDF = pdf(<PdfDocument {...props} />)
				const blob = await PDF.toBlob()
				//PDF.updateContainer(createElement(PdfDocument, props));
				//blob = await PDF.toBlob();
				sendOutput(noodlNode, 'blob', blob)
				setTimeout(() => {
					sendOutput(noodlNode, 'creating', false)
					sendSignal(noodlNode, 'created')
				})
			},
			reset() {
				sendOutput(noodlNode, 'blob', null)
				sendSignal(noodlNode, 'reseted')
			},
		}),
		[props]
	)

	return null
})
