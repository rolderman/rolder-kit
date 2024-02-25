import { BaseReactProps, CompDefinition, CompVersions, GraphModel, GraphModelNode, NodeContext, ReactNodeDef } from "../../types"
import { hasWarings } from "../funcs/warnings"
import { Suspense, forwardRef, useImperativeHandle, useRef } from "react"
import getReactNodePorts from "./getReactNodePorts"
import React from "react"
import { NodePort } from "@shared/port"
import getProps from "../funcs/getProps"
import { setNodeParameterDefault } from "../funcs/defaults"
import { convertAndCheckProp } from "../funcs/convertAndCheckTypes"

type Params = {
    moduleName: string
    allowChildren?: boolean
    loaderAnimation?: boolean
}

function getModule(version: CompDefinition, moduleName: string) {
    try {
        const modulesOverrides: { [name: string]: CompDefinition['module']['default'] }
            = eval(Noodl.getProjectSettings().modules)?.[0] || {}
        const moduleType = window.offlineMode && version.module.default !== 'static'
            ? 'dynamic'
            : modulesOverrides[moduleName] || version.module.default
        const module = version.module[moduleType]
        if (module) return module
        else if (version.module[version.module.default]) return version.module[version.module.default]
        else {
            log.error(`Parse module type error`, { moduleName, moduleType, version })
            return null
        }
    } catch (e) {
        log.error('Error at getModule', e)
        return null
    }
}

export const reactNode = (nodeName: string, versions: CompVersions, params: Params): ReactNodeDef => {
    return {
        name: `rolder-kit.${nodeName}`,
        displayName: nodeName,
        noodlNodeAsProp: true,
        allowChildren: params.allowChildren || false,
        getReactComponent() {
            return forwardRef(function (props: BaseReactProps, ref) {
                const localRef = useRef<any>(null)
                useImperativeHandle(ref, () => ({ signal(name: string) { localRef.current?.[name]() } }))
                const version = props.version

                const p = version ? getProps(versions, props) : {}

                const Comp = !hasWarings(props.noodlNode) && version
                    ? getModule(versions[version], params.moduleName)
                    : null

                return Comp
                    ? <Suspense fallback={
                        params.loaderAnimation
                            ? <div style={{ padding: 24, margin: 'auto' }}>Loading...</div>
                            : null}
                    >
                        <Comp {...p} ref={localRef} />
                    </Suspense>
                    : null
            })
        },
        methods: {
            // on inputs data change
            registerInputIfNeeded: function (inputName: any) {
                if (this.hasInput(inputName)) return
                this.registerInput(inputName, {
                    set: function (value: any) {
                        const version = this._inputValues.version
                        const inputs = versions[version]?.inputs
                        const nodePort = inputs?.find(i => i.name === inputName)
                        if (nodePort?.type === 'signal') {
                            if (value === true) this.innerReactComponentRef?.signal(inputName)
                        } else {
                            this.props[inputName] = value
                            this.forceUpdate()
                        }
                    }
                });
            },
            // on outputs data change
            registerOutputIfNeeded: function (name: any) {
                if (this.hasOutput(name)) return
                this.registerOutput(name, { getter: () => this.outputPropValues?.[name] });
            },
        },
        setup: function (context: NodeContext, graphModel: GraphModel) {
            if (!context.editorConnection || !context.editorConnection.isRunningLocally()) { return }

            // add outputs from input value
            function addNodePorts(versions: CompVersions, node: GraphModelNode, nodePorts: NodePort[]) {
                try {
                    const nodeInputs = versions[node.parameters.version]?.inputs?.filter(i => i.customs?.addNodePorts)
                    let np = nodePorts
                    if (nodeInputs?.length) nodeInputs.forEach(nodeInput => {

                        const n = nodeInput.name
                        let p = node.parameters[n]
                        p = setNodeParameterDefault(nodeInput, p)
                        p = convertAndCheckProp(node, context, nodeInput, p)

                        if (nodeInput.customs?.addNodePorts) {
                            const func = nodeInput.customs?.addNodePorts
                            if (p) {
                                const outputPorts = func(p)
                                np = [...nodePorts, ...outputPorts]
                            }
                        }
                    })
                    return np
                } catch (e) { log.error('Add node ports error', e) }
            }

            graphModel.on(`nodeAdded.rolder-kit.${nodeName}`, function (node: GraphModelNode) {
                if (!node.nodeProps) node.nodeProps = {}
                const nodePorts = getReactNodePorts(node, context, versions)
                context.editorConnection.sendDynamicPorts(node.id, addNodePorts(versions, node, nodePorts))

                node.on('parameterUpdated', function () {
                    const nodePorts = getReactNodePorts(node, context, versions)
                    context.editorConnection.sendDynamicPorts(node.id, addNodePorts(versions, node, nodePorts))
                })
            })
        }
    }
}