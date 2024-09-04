import type { PortDef } from '@shared/port-v1.0.0';
import type { GraphModelNode, JsNodeVersions, NodeContext, ReactNodeVersions } from '../../main';
import { clearWarning, hasWarnings, sendWarning } from './warning';

export const prepareParameters = (model: GraphModelNode, context: NodeContext, versions: JsNodeVersions | ReactNodeVersions) => {
	model.parametersCache = {};
	context.editorConnection.clearWarnings(model.component.name, model.id);

	const inputDefs = versions[model.parameters.version].inputs || [];
	// Простые инпуты, не требующие конвертации.
	const literalInputDefs = inputDefs.filter((i) =>
		typeof i.type === 'string' ? !['array', 'proplist', 'objectEval', 'funcEval'].includes(i.type) : true
	);
	const complexInputDefs = inputDefs.filter((i) => !literalInputDefs.map((i) => i.name).includes(i.name));
	// В конвертации, в эвалах, разработчик ждет готовые props. Поэтому готовим все, что можем перед ней.
	// Подготовим параметры. Все, еще не конвертируя и не валидируя.
	setParameters(model, inputDefs);
	// Сконвертируем простые типы.
	literalInputDefs.forEach((inputDef) => (model.parametersCache[inputDef.name] = getConverted(model, context, inputDef)));
	if (hasWarnings(model, context)) return;
	// Валидируем простык типы.
	literalInputDefs.forEach((inputDef) => validateType(model, context, inputDef));
	if (hasWarnings(model, context)) return;
	// Сконвертируем сложные типы.
	complexInputDefs.forEach((inputDef) => (model.parametersCache[inputDef.name] = getConverted(model, context, inputDef)));
	if (hasWarnings(model, context)) return;
	// Валидируем сложные типы.
	complexInputDefs.forEach((inputDef) => validateType(model, context, inputDef));
};

// Установка значений с параметров портов.
const setParameters = (model: GraphModelNode, inputDefs: PortDef[]) => {
	for (const inputDef of inputDefs) {
		const inputName = inputDef.name;

		// Параметр установлен.
		if (model.parameters[inputName] !== undefined) {
			model.parametersCache[inputName] = model.parameters[inputName];
			// Параметра нет, но есть дефолт.
		} else if (inputDef.default !== undefined) {
			model.parametersCache[inputName] = inputDef.default;
			model.parameters[inputName] = inputDef.default;
			// Параметра нет и нет дефолта.
		} else delete model.parametersCache[inputName];
	}
};

// Функция проверяет соответствие типа данных между тем, что задано в декларации инпута и фактическим значением.
// Стандартные типы проверяются простым сравнением. Специализированные Roodl и наши eval порты проверяются каждый по своему.
export const validateType = (model: GraphModelNode, context: NodeContext, inputDef: PortDef) => {
	const sendTypeWarning = (defType: any, valueType: any) => {
		sendWarning(
			model,
			context,
			inputDef.displayName,
			`Input "${inputDef.displayName}" type error:<br/>Expect "${defType}", got "${valueType}".`
		);
	};

	const value: unknown = model.parametersCache[inputDef.name];

	if (value !== undefined) {
		const defType = inputDef.type;
		const valueType = R.libs.just.typeOf(value);

		// eval порты могут содержать закомментированные примеры, из-за чего convertProp получает value с данными и выдает undefined.
		// Если не убрать эти undefined, сравнение по типу будет не корректным.
		if (value !== undefined) {
			// Все кроме enum.
			if (typeof defType === 'string') {
				// Исключим, что нет смысла проверять.
				if (['*', 'component', 'proplist', 'signal'].includes(defType)) return;

				// Для funcEval нужно заменить тип в сообщении, чтобы слово eval не смущало разработчика.
				if (defType === 'funcEval') {
					if (valueType !== 'function') sendTypeWarning('function', valueType);
					else clearWarning(model, context, inputDef.displayName);
					return;
				}

				// Для objectEval не стандартное сообщение.
				if (defType === 'objectEval') {
					if (valueType !== 'object')
						sendWarning(
							model,
							context,
							inputDef.displayName,
							`Input "${inputDef.displayName}" type error:<br/>Must be function with "object" return type, got "${valueType}" return type.`
						);
					else clearWarning(model, context, inputDef.displayName);
					return;
				}

				// Здесь все литералы.
				if (defType !== valueType) sendTypeWarning(defType, valueType);
				else clearWarning(model, context, inputDef.displayName);
			}

			// enum.
			if (Array.isArray(defType)) {
				if (valueType !== 'string') sendTypeWarning('string', valueType);
				else clearWarning(model, context, inputDef.displayName);
			}
		}
	}
};

// Функция конвертирует параметры ноды.
export const getConverted = (model: GraphModelNode, context: NodeContext, inputDef: PortDef) => {
	const value: unknown = model.parameters[inputDef.name];

	if (typeof inputDef.type === 'string') {
		if (['array', 'objectEval', 'funcEval'].includes(inputDef.type)) {
			let evalFunc: any;
			// trycatch из-за того, что ничто не мешает разработчику сохранить ошибку в редакторе.
			try {
				evalFunc = eval(value as string);
				// evalFunc - функция, то просто возвращаем. Если объект, то нужно выполнить функцию, проверить, что вернулся объект и вернуть его.
				if (inputDef.type === 'objectEval') evalFunc = evalFunc?.(model.parametersCache);
				clearWarning(model, context, inputDef.displayName);
			} catch (error) {
				sendWarning(model, context, inputDef.displayName, `Input "${inputDef.displayName}" error:<br/>${error}`);
			}

			return evalFunc;

			// Преобразуем proplist в обычный массив.
		} else if (inputDef.type == 'proplist') {
			return (value as { label: string }[])?.map((i) => i.label);
		} else return value;
	} else return value;
};

export const validateParameterValues = (
	model: GraphModelNode,
	context: NodeContext,
	versions: JsNodeVersions | ReactNodeVersions
) => {
	const inputDefsWithVaildate = versions[model.parameters.version].inputs?.filter((i: PortDef) => i.validate) || [];

	for (const inputDef of inputDefsWithVaildate) {
		// Не будем валидировать, если есть подключение.
		if (model.component.connections.some((i: any) => i.targetId === model.id && i.targetPort === inputDef.name)) return;
		const validateResult = inputDef.validate?.(model.parametersCache);
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string') sendWarning(model, context, inputDef.displayName, validateResult);
		// Стандартный текст ошибки, если рзработчик вернул false.
		if (validateResult === false)
			sendWarning(model, context, inputDef.displayName, `Input "${inputDef.displayName}" is required.`);
		// Сброс ошибки
		if (validateResult === true) clearWarning(model, context, inputDef.displayName);
	}
};
