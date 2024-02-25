import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { MultiSelect } from "@mantine/core"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@shared/port-send'
import convertColor from "@shared/convert-color"
import convertForSelectInputs from '@shared/convert-for-select-inputs'
import getValue from "@shared/get-value"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]
    const { noodlNode, inputItems, labelField, defaultItems } = props

    const [data, setData] = useState<any>([])
    useEffect(() => {
        if (!inputItems?.length) setData([])
        if (inputItems && labelField && inputItems?.some((i: any) => getValue(i, labelField))) {
            const convertedItems = inputItems.map(i => convertForSelectInputs(i, labelField))
            setData(convertedItems.filter(i => i && i.label && i.value))
        }
    }, [inputItems, labelField])
    
    const [value, setValue] = useState<string[]>([])
    useEffect(() => {
        if (defaultItems) {
            const value = defaultItems?.map((i: any) => i.value || i.id || i.label) || []
            setValue(value)
        }
    }, [defaultItems])

    useImperativeHandle(ref, () => ({
        resetSelected() {
            setValue([])
            sendOutput(noodlNode, 'selectedItems', [])
            setTimeout(() => sendSignal(noodlNode, 'reseted'))
        }
    }), [])
    useEffect(() => { return () => { sendSignal(noodlNode, 'closed') } }, [])

    return <MultiSelect
        nothingFound="Не найдено"
        getCreateLabel={(value) => `+ Создать "${value}"`}
        onCreate={(value) => {
            sendOutput(noodlNode, 'newValue', value)
            sendSignal(noodlNode, 'newValueSubmited')
            return undefined
        }}
        data={data}
        value={value}
        icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
        error={props.inputError || false}
        onChange={(v) => {
            setValue(v)
            if (!v) {
                sendOutput(noodlNode, 'selectedItems', [])
                setTimeout(() => sendSignal(noodlNode, 'reseted'))
            } else {
                const selectedItems = props.inputItems?.filter((i: any) => v.includes(i.value) || v.includes(i.id) || v.includes(i.label))
                sendOutput(noodlNode, 'selectedItems', selectedItems)
                setTimeout(() => sendSignal(noodlNode, 'selected'))                
            }
        }}
        {...props}
        {...props.customProps}
    />
})