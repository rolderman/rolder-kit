# Rolder Kit

## Это такой кит, большой и красивый.

[Документация и changelog](https://docs.rolder.app)

## Структура репозитария и понятия

- **.moon** - конфигурация `планера задач`.
- **build** - итоговый `билд` RK, генерируемый с помощью `moon :build`.
- **developers** - `конфигурации` проектов Roodl для разработки RK в них.
- **packages** - `пакеты`, на которые разбит RK. Один пакет содержит один или несколько `нод`.
- **nodes** - `ноды` RK. Одна `нода` всегда состоит из `React-ноды`/`JS-ноды` и `компоненты` - неспосредственного кода.
- **shared** - внутренние `утилиты` или `библиотеки`, используемые как в `пакетах`, так и `нодах`.
- **package.json** - есть в корне, в каждом `пакете` и `ноде`. Зависимости `библиотек` устроены иерархично. Если что-то прописано на верхнем уровне, это можно импортировать на любом нижнем.
- **rspackBase.config** - базовый конфик `Rspack`, нашего `сборщика` RK. В каждои `пакете` есть свой `rspack.config.js`, уточняющий базовый.
- **pnpm-workspace.yaml** - конфигурация pmpm-workspace, за счет которой + `moon`, все это превращяется в автоматизированный `монорепозитарий`.
- **остальные** - настраивают `git`, `prettier` - автоформатирование кода, `postcss` - пост-обработчик `CSS` для `Mantine`, `rolder-kit.code-workspace` - настройки `VS Code`.

## Запуск задач

- `moon :build` - создает билд RK.
- `moon названиеПакета:build` - создает билд указанного пакета RK.
- `moon :clean` - удаляет все node_modules. Рекомендовано запускать эту задачу и удалять `.moon/cache` перед билдом нового релиза.
- `moon :dev -- --env=developer=никРазработчика project=названиеПроекта` - создает не сжатый билд RK и кладет его в указанный Roodl-проект. При изменении кода перезапускается и заменяет билд-файлы.
- `moon названиеПакета:dev -- --env=developer=никРазработчика project=названиеПроекта` - как команда выше, но для одного пакета.

## Памятка по разработке нод

### Структура папок

Весь код ноды находится в папке `nodes`. `packages` только сктруктурирует ноды по пакетам (то что в итоге собирается в папки). Тут только импорт и минимальные параметры, которые нельзя указать для отдельных версий. В `nodes` и `packages` своя структура, следуй ей используя примеры.

Каждая нода имеет версию и лежит в отдельной папке с названием версии. Если это модульная нода, то рядом с версиями нужно положить папку `modules`. В этой папке модули повторяют структуру ноды, включая версионность (смотри `Table`). Cтруктура ноды, которой нужно следовать:

- **package.json** - минимально содержит три параметра:

```json
{
	"name": "@nodes/text-v2.0.0",
	"main": "node/definition.ts",
	"type": "module"
}
```

К ним добавляются `dependencies` для библиотек и `devDependencies` для типов TypeScript. Важно их не путать, т.к. первые попадают в итоговый бандл, вторые нет.

- **node** - код для интеграции ноды с Roodl. Минимально здесь находится декларация ноды `definition`. Для сложных нод, здесь могут быть дополнительные файлы. Смотри пример `useData`, где проверяется схема и создается хранилище.
- **component** - код разрабатываемой ноды. Минимально - это один входной файл, которые импортируется в `definition`.
- **types.d.ts** - типизация компоненты. При типизацию отдельно ниже.

### Декларация

Декларация - это схема, определяющая базовые праметры, задающая входные/выходные порты ноды и их поведение. Для каждой версии ноды своя декларация.

Создание делкарации разбито на 2 части. Первая, верхенеуровневая задает параметры, которые нельзя указать на уровне версий и импортирует декларации версий, вторую часть. Нужно использовать наши функции - `jsNode` и `reactNode`. Они принимают три параметра:

- Название ноды. Для js-нод c маленькой буквы, для react-нод с большой. Название будет видно в Roodl ровно как указано. Под капотом функция добавит системное название `rolder-kit.api-v1${nodeName}`, отличив наши ноды от всех других. `api-v1` нужен, чтобы была возможность совместить несколько версий RK в одном проекте, когда поменялся наш способ интеграции с Roodl. Это так же создает контекст. Некоторые библиотеки не видят код из другого контекста. Из-за чего, смена api дело трудоемкое.
- Декларации версий. Это объект, где ключ - версия без хештега, значение - сама декларация.
- Параметры. Это объект. Он один на все версии. Т.е. мы не моем менять их для каждой версии отдельно. При изменении треубется перезайти в проект. Параметры, все опциональны:

  - `color`. Цвет ноды. Только JS-ноды. TS предложит варианты. Общая логика такая. Визуальная нода - синий, работа с бекенд или интеграциями - зеленый, все остальное - фиолетовый. Серый не используем, чтобы разработчик легко отличал свои повторяемые функции от RK. Если не установить цвет, js-нода будет зеленой, а react-нода синей.
  - `allowChildren`. Разрешить вставлять детей. Только React-ноды. Отключено по дефолту.
  - `docs`. Ссылка на документацию. Если ссылка есть, в панели параметров рядом с переименованием и удалением появится вопросик для перехода. Документация не отображается в браузере компонентов Roodl.

Декларация версии:

- `hashTag`. Добавляет к отображаемой версии ноды выбранный хеш-тег.
- `module`. Единственный обязятельный параметр.
  - `static`. В теле до экспорта нужно добавить импорт текущей версии и добавить название импорта в значение ключа `static`. Такой вид импорта не выделяет код в отдельный файл и он будет загружаться вместе с приложением не зависимо от того используется нода или нет.
  - `dynamic`. В ключ нужно передать динамичный импорт - `module: { dynamic: import('../component/search') }` для JS и `module: { dynamic: lazy(() => import('../component/Stack')) }` для React. Такой вид импорта выделит код в отдельный файл и он будет загружаться в момент первого использования ноды.
- `inputs`. У инпутов больше всего параметров и больше всего обработки. На уровне декларации инпут - это тоже декларация, т.е. это форма удобная для описания декларации и внутреннего применения в `jsNode` и `reactNode`. Под капотом они преобразуются в нужную `Roodl` форму в стандартизованном виде. Задается массивом, в котором каждый инпут нужно получать через функцию-парсер декларации - `getPortDef`. Эта функция подскажет, что можно делать, а что нельзя. Порядок в массиве имеет значение, ровно как задан, так и будет отображен в редакторе. Больше нет возможности задавать инпуты по шаблонам кучей. Это сделано во избежании лишнего кода в каждой ноде. Есть два стандартных порта, которые автоматически добавляются в массив: `version` - порт с выбором версии, всегда первый и `customProps` - функция, которая возвращает любые кастомные настройки разработчка в `Roodl`, которые может использовать разработчик ноды, всегда последний. Декларация инпута, которую нужно подавать в `getPortDef` (все параметры обязательны, кроме специально отмеченных):
  - `name`. Название инпута. Будет переданно в функцию разрабатываемого модуля через `props` с таким же названием.
  - `displayName`. Отображаемое имя для разработчика. Пишем с большой буквы предложением, пример - `Custom props`.
  - `group`. Название группы. Выбор из списка, т.е. названия стандартизованы, но можно выбрать `Custom`, тогда в параметре ниже можно указать любое название.
  - `customGroup`. Опционально. Название кастомной группы, если выше выбран `Custom`.
  - `type`. Тип инпута. На типах много завязано. Происходит несколько проверок, часть встроенные, часть разработчик может задать сам. Любые проверки выдают ошибки при их не прохождении. В отличии от предыдущей версии, больше не нужно перезагружать приложение, чтобы сбросить ошибку, достаточно подать новое корректное значение. Подробнее:
    - Литералы - `string`, `number` и `boolean`. Простые типы, не конвертируются, проверяются на соответсвие. При не соответствии типа разработчику будет показана соотвествующая ошибка.
    - `signal`. Сигнал. Не проходит проверок. Сигнал - это простой тогл true/false. Когда сигнал подан - true и тут же false. Под капотом мы реагируем на true.
    - `object`. Объект. Можно подавать только через подключение, в редакторе не доступен. Проверяется на то, что он объект.
    - `array`. Массив. Если подан через подключение, проверяеться, что массив. Если через редактор, то это текст, т.к. параметры редактора сохраняются в `project.json`, а массив может содержать функции. Преобразуется в массив с отлавливанием ошибок синтаксиса.
    - `proplist`. Список текстовых праметров. Задается только через редактор. Под капотом - это массив текстов. Не проверяется.
    - `component`. Путь к шаблонку компоненты. Обычный тектс, не проверяется.
    - `objectEval`. Наш специальный тип. Это функция, которая принимает текущие `props` и должна вернуть объект. Под капотом в `Roodl` подается как тип `array`, благодаря чему разработчик может устанавливать значение в редакторе, причем не как массив, а сразу функцией. Как и массив, `Roodl` сохранит функцию текстом. Преобразуется в функцию. Проверяется, что это функция, что нет синтаксических ошибок и что возвращаемое значение объект.
    - `funcEval`. Наш специальный тип. Так же как `objectEval`, но ничего не возвращает.
    - Enum. Специальный тип для выбора из списка. Задается как массив объектов, с двума ключам `label` и `value`. Оба всегда текстовые.
  - `default`. Опционально. Дефолтное значение. Можно устанавливать только для простых типов.
  - `codeComment`. Опционально. Для типов `array`, `objectEval` и `funcEval` можно указать комментарий. Такой комментарий будет виден в редакторе, но будет удален при конвертации. Хороший пример - указать закомментированный пример схемы, массива или функции. Тогда разработчику остается убрать скобки комментариев и код готов.
  - `visibleAt`. Опционально. Видимость порта: `editor` - только в редакторе, `connection` - только через подключение, `both` - оба. Если не указать будет `both`.
  - `tooltip`. Опционально. Подсказка. Подается в виде текста, который может содержать стандартные `HTML`-теги. Учти, текст изначально жирный. Пробовал выделять тектс косым, вставлять картинки, делать списки, смотреть кино. Все работает. Можно форматировать `JSON`, смотри функцию `validateFetchScheme` в `useData` для примера.
  - `dependsOn`. Опционально. Функция, делающая инпут зависимым. Принимает текущие `props`, должна вернуть `true/false`. При положительном возврате порт будет добавлен, иначе нет. Запускается после конвертации значений и присвоения дефолтов, что дает актуальные `props`.
  - `validate`. Опционально. Функция для проверки значения. Заменяет устаревший параметр `required`. Принимает текущие `props`. Нужно веруть `true` - валидация прошла успешно, `false` - валидация не прошла, разработчику будет показано сообщение `Input "${inputDef.displayName}" is required.`, `string` - валидация не прошла, разработчику будет показано твое сообщение.
  - `transform`. Опционально. Функция преобразования порта. Преобразует изначальную декларацию в новую. Пример - когда тип указан списком и состав списка нужно менять в зависимости от значения других параметров. Принимает текущие `props` и текущую декларацию инпута. Нужно вернуть новую декларацию инпута. Если в новой декларации будет задан `default`, он будет сконвертирван, если нужно и проверен на тип.
- `outputs`. Задаются как `inputs`, поддерживая все параметры. Логично, что не все типы (кастомные и те, что имеют смысл только в редакторе) имеют смысл, нет смысла делать валидацию (это задача разработчика ноды), нет смысла в дефолте и подсказке. Но часто нужно указать `dependsOn`, изредка `transform`. Значения никак не конверируются и не проверяются.
- `triggerOnInputs`. Только для JS-нод. Функция, указывающая список инпутов, на подачу которых нужно запускать реактивную js-функцию. Принимает текущие `props`, нужно вернуть список с названиями портов. Список не проверяется. Подробнее зачем это нужно ниже.
- `getInspectInfo`. Функция для отображения полезной информации над нодой. Принимает текущие `props` и значения выходных портов. Нужно вернуть массив, в котором объекты - это раздел с отображаемой информацией. Вот пример, где первая строка простой текст, имитирующий заголовок, воторая массив:

```ts
getInspectInfo(p, outProps) {
	if (p.fields)
		return [
			{ type: 'text', value: 'Search fields' },
			{ type: 'value', value: p.fields },
		];
	else return [];
},
```

- `transform`. Функция преобразования всех портов. Работает как `transform` для одного порта, но на вход получает все порты в объекте, с разделением на `inputs` и `outputs`. Вернуть нужно объект с портами в таком же формате. Это заменяет устаревшую `addNodePorts`.
- `initialize`. Функция для одноразового запуска любого кода до первого запуска JS-ноды или первого рендера React-ноды. Принимает `props`, нужно вернуть их же. Код может быть асинхронным.
- `disableCustomProps`: Параметр отключения встроенного инпута `customProps`.

#### Области исполнения кода

Можно разделить кода на 2 этапа запуска:

- **До регистрации ноды в Roodl**. Если посмотреть `index.html` в любом проекте Roodl с RK, то станет понятно, что каждый пакет RK загружаетс вместе с самим Roodl и с React. Это означает, что еще нет глобальных объектов. Для нас важны 2 - `Noodl` (есть, но урезанный) и `R`.
- **После регистрации ноды в Roodl**. Здесь нет никаких ограничений, все глобальные объекты доступны. Разработчик в Roodl имеет доступ только к этой области. Но может указывать код в `Head Code`.

Вот пример:

```ts
import '@shared/types-v0.1.0';
import { defineNode } from '@noodl/noodl-sdk';

import search from './src/search';
import useData from './src/useData';

const jsPackages = [search, useData];

Noodl.defineModule({ nodes: jsPackages.map((i) => defineNode(i)) });
```

Здесь видно, что используется `defineModule` из глобально заданного `Noodl`, но не используется `defineNode`. Если вывести `Noodl` в зупущенном проекте, то мы увидим большую структуру, включая `defineNode`. Но если вывести `Noodl` (или `window.Noodl`) в теле этого примера, то там будет минимальная труктура, включающая пару параметров и `defineModule`.

Еще один пример. Везде, где можно стараюсь брать библиотеки из `R.libs`, чтобы не увеличивать бандл. В `useData` используется валидация схемы через библиотеку `valibot`. Для нее нужно задать схему, которая по сути просто куча функций. Схема называется `FetchScheme` и расположена внтури `validateFetchScheme`, которую запускает `validate` с декларации порта `fetchScheme`. Если расположить схему `fetchScheme` в корне тела файла, то библиотеку `valibot` из `R.libs` не удастся использовать, т.к. `FetchScheme` запускает фнкции `valibot` сразу при импорте, а `R` просто еще нет. Поэтому, `FetchScheme` лежит внутри `validateFetchScheme`, которая запускается сразу после регистрации ноды.

#### Типизация

Есть **глоабльная** и **локальная** типизации.
**Глоабльная** задается пакетом `@shared/types-v0.1.0`. Определяет глобальные переменные - `R`, `Noodl` и `log`, а так же экспортирует некоторые глобальные типы - `NoodlNode`, `Item`, `DbClass` и другие. Для использования глобальных переменных нужно задать такой импорт - `import '@shared/types-v0.1.0'`. Для импорта конкретного типа данных такой - `import type { Item } from '@shared/types-v0.1.0'`. Первое не перекрывает второе, но можно совмезать.

**Локальная** устанавливается через файл `types.d.ts` в каждой ноде. Вот минимальный пример.

```ts
import type { BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps;
```

`BaseReactProps` или `BaseJsProps` - это минимальная типизация любой компоненты. Ткни через control, чтобы изучить.
Чтобы добавить свои типы, нужно расширить базовый:

```ts
import { BaseJsProps } from '@shared/node-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';
import type { IFuseOptions } from 'fuse.js';

export type Props = BaseJsProps & {
	fields?: string[];
	minMatchCharLength?: number;
	searchString?: string;
	customOptions?: IFuseOptions<Item>;
	items?: Item[];
};
```

##### Сопосталвние типов инпутов ноды с типами TypeScript

Решил описать это, т.к. есть не мало различий, который приводят к неверной локальной типизации.

- Если порт валидируется `validate`, то типу можно доверять.
- Если `visibleAt` равен `editor`, то типу можно доверять.
- Если валидации нет и `visibleAt` не равен `editor`, то всегда опционално и типу можно доверять.

### React-нода

React-нода всегда одна React-компонента, которая является точкой входа. Дальше, сколько угодно.

#### Требования

- Исползьуемые библиотки должны поддерживать React 18.
- Экспорт должен быть всегда дефолтным.
- `forwardRef` обязателен.

#### Входные сигналы

Для принятия сигнала внутри React-компоненты нужно использовать хук `useImperativeHandle` с такими параметрами:

- Первым параметром нужно передать `ref`, который подает `forwardRef` воторым параметром после `props`.
- Вторым параметром должна быть функция без параметров, которая должна вернуть объект с ключями-функциями. Каждый ключ-функция - это сигнал, его название должно совпадать с входным сигналом. На вход эта функция передает текущие props. Возвращать ничего не нужно.
- Третий параметр - зависимости. Если до хука `useImperativeHandle` есть какието константы, состояния или функции, их можно перечислить массивом. Так они передаются в ключи-функции. Это нужно, т.к. эти функции выполняются родительской React-нодой, а не текущей.

Вот как может выклядеть компонента с сигналами:

```ts
export default forwardRef((props: Props, ref) => {
	const [selectedItem, setSelectedItem] = useState<Item | undefined>();

	useImperativeHandle(
		ref,
		() => ({
			setSelectedItem(p) {
				if (p.selectedItem) setSelectedItem(p.selectedItem);
				else setSelectedItem(undefined);
			},
			resetSelectedItem() {
				setSelectedItem(undefined);
			},
		}),
		[someState, setState]
	);

	return <SomeComponent />;
});
```

Если компонент несколько, нужно поднять `ref` до верхней компоненты через `useRef`, иначе придется повторять `useImperativeHandle` в каждой. Смотри пример в `Table`, где хранилище из дочерней компонентой поднимается в родительскую.

Как это работает. `ref` - это своего рода ссылка на DOM-ноду. В React его используют как константу (в теле React-компоненты не может быть переменных). `forwardRef` передает ref от родителя (или наоборот? :) ). `useImperativeHandle` добовляет в этот `ref` ключи функции. В результате, родительская компонента получает эти функции и может выполнять. Наша интеграция использует `ref`, ищет там эти функции по названию сигналов и запускает.

### JS-нода

Если React-нода - это одна React-компонента, то JS-нода - это объект с одной или несколькими функциями ключами.

#### Требования

- Должен быть дефолтный экспорт.
- Название ключей должны совпадать с названием входных сигналов или называться `reactive`.
- В делкарации должен быть объявлен соотвествующий порт-сигнал и/или `triggerOnInputs`, выдающий список портов, на подачу которых будет запускаться `reactive`.
- Функции могут быть асинхронными, но нужно учитывать, что пока не завершилась асинхронная функция, повторный запуск этой или других ключей-функций не возможен. При этом значения портов сохраняется в любой момент.

#### Варианты использования

Раз JS-нода это объект с функциями, то можно передать его в константу и экспортировать эту константу. Тогда внтури функций объекта можно запускать другие функции этого же объекта. Такой подходи называют `Фабрикой`.

- Классический вариант. Название функций должно совпадать с названиями сигналов. Сигнал будет просто запускать такую функцию. Функции `reactive` не должно быть. `triggerOnInputs` должен отсутстовавть.
- Реактивный вариант. Функция должна называться `reactive`, сигналов не должно быть. В декларации ноды `triggerOnInputs` должен вернуть список инпутов. Сама `triggerOnInputs` принимает текущие `props`. Функция запустится всякий раз при обновлении значений инпутов из списка.
- Комбинированный вариант. Повторяем первые два. Имеет смысл в сценариях, когда основное поведение задано через реактивную функцию, а сигналы служат для каких-то отдельных задач. Редкая история, чаще всего хватает первых двух. Что точно не верно - это пытаться делать одно и тоже и через сигнал и реактивно.

#### Примеры

Классический или сигналы.

```ts
export default {
	sendData: (p: Props) => {
		// Какой то код
	},
	setServerState: (p: Props) => {
		// Какой то код
	},
};
```

Реактивный вариант.

```ts
export default {
	reactive: (p: Props) => {
		// Какой то код
	},
};
```

Комбинированный вариант.

```ts
export default {
	reactive: (p: Props) => {
		// Какой то код
	},
	sendData: (p: Props) => {
		// Какой то код
	},
};
```

Фабрика.

```ts
const myFabric = {
	reactive: (p: Props) => {
		// Какой то код
	},
	sendData: async (p: Props) => {
		// Какой то код
	},
	someExtraUsefulFunc: async (p: Props) => {
		const result = await myFabric.sendData({ ...p, someNewProp: 'value' });
		if (result) doSomething;
	},
};
export default myFabric;
```
