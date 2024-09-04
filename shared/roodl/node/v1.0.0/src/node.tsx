/* Интеграция нод в Roodl. */

import { forwardRef, Suspense } from 'react';
import type {
	GraphModel,
	GraphModelNode,
	JsRoodlNode,
	JsNodeVersions,
	NodeColor,
	NodeContext,
	RoodlNode,
	ReactRoodlNode,
	Props,
	ReactNodeVersions,
	NodeDef,
} from '../main';
import { getVersionPort, validateVersion } from './editorModels/version';
import { getConverted } from './editorModels/parameter';
import { getModule } from './runtimeModels/module';
import { getNodeInputDefs, handleNodePorts } from './editorModels/nodePort';
import { clearWarning, hasWarnings } from './editorModels/warning';
import { schedule } from './runtimeModels/schedule';

const getShared = (nodeName: string, versions: JsNodeVersions | ReactNodeVersions, docs?: string) =>
	({
		name: `rolder-kit.api-v1.${nodeName}`,
		displayName: '*' + nodeName,
		docs,
		initialize: function () {
			this.firstRun = true;
			this.scheduledRun = false;
			this.scheduledModuleRun = false;
			this.props = {}; // Хранилище входных props.
			this.outputPropValues = {}; // Хранилище выходных props.
		},
		// Выдадим над нодой короткую информацию о праметрах.
		getInspectInfo() {
			const version = this._inputValues?.version;
			let output;
			const getInspectInfo = versions[version]?.getInspectInfo;
			if (getInspectInfo) output = getInspectInfo(this.props || {}, this.outputPropValues || {}, this as any);
			return output;
		},
		methods: {
			// Регистрирует инпут и слушает изменения.
			registerInputIfNeeded: function (inputName: string) {
				if (this.hasInput(inputName)) return;
				this.registerInput(inputName, {
					set: function (value: unknown) {
						const v = this._inputValues.version;
						this.props.version = v;
						const nodeDef = versions[v] as NodeDef | undefined;
						const inputDef = nodeDef ? getNodeInputDefs(nodeDef, versions)?.find((i) => i.name === inputName) : undefined;

						if (nodeDef && inputDef) {
							// Значение пришло через подключение.
							if (this._hasInputBeenSetFromAConnection(inputName)) {
								//console.log('from connection', nodeName, inputName, value);
								this.props[inputName] = value;
								// Уберем ошибку, если приелетело значение с порта. Это не работает в обратную сторону.
								if (!Noodl.deployed && value !== undefined) clearWarning(this.model, this.context, inputDef.displayName);
							} else {
								// Значение пришло с редактора. Не отрабатывает дефолты редактора.
								//console.log('from editor', nodeName, inputName, value, this.props.noodlNode);
								this.props[inputName] = getConverted(this.model, this.context, inputDef);
							}

							if (!Noodl.deployed && hasWarnings(this.model, this.context)) return;
							else schedule(this, nodeDef, inputDef, inputDef.type === 'signal' && value === true);
						}
					},
				});
			},
			// Зарегистрируем аутпут и укажем как брать его с хранилища. sendOutput потом использует его для отправки.
			registerOutputIfNeeded: function (name: string) {
				if (this.hasOutput(name)) return;
				this.registerOutput(name, { getter: () => this.outputPropValues?.[name] });
			},
		},
		setup: function (context: NodeContext, graphModel: GraphModel) {
			// Только во время разарботки в Roodl.
			if (!context.editorConnection || !context.editorConnection.isRunningLocally()) return;

			const versionPort = getVersionPort(versions);

			graphModel.on(`nodeAdded.rolder-kit.api-v1.${nodeName}`, async function (model: GraphModelNode) {
				if (!model.parameters.version) {
					context.editorConnection.sendDynamicPorts(model.id, [versionPort]);
					validateVersion(model, context);
				} else await handleNodePorts(model, context, versions);

				model.on('parameterUpdated', async function (port) {
					if (port.name === 'version') {
						validateVersion(model, context);
						if (port.value === undefined) context.editorConnection.sendDynamicPorts(model.id, [versionPort]);
						else await handleNodePorts(model, context, versions);
					} else await handleNodePorts(model, context, versions);
				});
			});
		},
	} as RoodlNode);

export const jsNode = (nodeName: string, versions: JsNodeVersions, params?: { docs?: string; color?: NodeColor }) =>
	({
		color: params?.color || 'green',
		...getShared(nodeName, versions, params?.docs),
	} as JsRoodlNode);

export const reactNode = (nodeName: string, versions: JsNodeVersions, params?: { docs?: string; allowChildren?: boolean }) => {
	return {
		allowChildren: params?.allowChildren || false,
		useVariants: false,
		noodlNodeAsProp: true,
		...getShared(nodeName, versions, params?.docs),
		getReactComponent() {
			return forwardRef(function (p: Props, ref) {
				// Не будем выдавать компоненту пока не выбрана версия.
				if (!p.version) return null;
				else {
					//console.log('forwardRef', p);
					const ReactComponent = getModule(versions[p.version]);
					// Если ошибка в импорте, вернем null.
					if (!ReactComponent) return null;
					else {
						// Передадим готовые props и поднимем выше ref, чтобы родители могли управлять.
						// Обернем в Suspense, чтобы не разруливать вручную динамичный и статичный импорты.
						return (
							<Suspense fallback={null}>
								<ReactComponent {...p} ref={ref} />
							</Suspense>
						);
					}
				}
			});
		},
	} as ReactRoodlNode;
};
