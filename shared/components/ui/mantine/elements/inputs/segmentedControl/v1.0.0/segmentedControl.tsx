import { forwardRef, lazy } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from '@shared/get-comp-props'

const FormSegmentedControl = lazy(() => import("./src/formSegmentedControl"))
const ControlledSegmentedControl = lazy(() => import("./src/controlledSegmentedControl"))

export default forwardRef(function (props: Props, ref) {
    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormSegmentedControl {...p} {...p.customProps} />
        : <ControlledSegmentedControl {...p} {...p.customProps} />
})