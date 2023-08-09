# Как устанавливать/обновлять Rolder Kit
* Скачиваем с этого репозитария из папки dist актуальную версию.
* В Noodl в настройках открываем папку проекта и копируетм Rolder Kit в папку noodl_modules.
* Переносим старую версию Rolder Kit из noodl_modules на всякий случвй. Не должно быть две версии. Что то работать будет, но запутаетесь легко.
* Перезаходим в проект, проверяем не ругается ли Noodl на какую то ноду.

# Структура Rolder Kit
* dist: архивы бандлов для скачивания и добавления в Noodl
* src: исходный код
    * utils: функции-помогайки. Сейчас там набор фнкций для обработки данных: конвертация версии класса БД, вытягивание данных из объекта по шаблону и т.д.
    * libs: фнкции-обертки для сторонних библиотек. Например, errorHandler простая обертка для Mantine notification. Или useData, в которой прописаны все методы для ноды UseData и фабрика генерации запросов keys: то самое главное, что дает нам простоту работы с данными в Rolder Kit.
    * types: типы Typescript.
    * jsNodes: "серые" ноды Noodl или "ноды-действия". Это не React ноды, а ноды Typescript. Сейчас используется простой принцип: одна нода = один сигнал запускащий ее. Примеры: notification для отправки всплывающих сообщений, все ноды в папке data для создания/изменения/удаления данных.
    * rNodes: "синие" ноды Noodl. Это только React-ноды. Могут находиться только в структуре странницы. Могут иметь или не иметь дочерние React-ноды. Не могут принимать сигналы, для этого исползуется инпуты boolean, которые конвертируются внутри ноды в сигнал.
    * main: основной модуль, который загружает весь Rolder-kit. Состоит из функции ports для определения inputs/outputs, nodes для импорта всех нод на уровне js и фнкции getNodes для подготовки самих нод для Noodl. С верcии Rolder Kit 0.2.0 удалось устроить так, что jsNodes и rNodes выглядят так, как если бы мы их просто создавали для классической разработки, а main уже делает всю магию по превращению их в ноду Noodl.

# Changelog
## 2023-08-08 v0.6.1
### Изменения нод:
#### PopoverActionIcon v0(.1.1)
* Добавлена дефолтная иконка, чтобы нода не вываливалась в ошибку.

## 2023-08-08 v0.6.0
### Общие изменения:
* Utils. Внутри Rolder Kit есть простые функции, которые часто нужно использовать, они выделены в отдельную папку. Часть из них есть смысл использовать на уровне Noodl. Добавил одну такую утилитку: FilterBy. Это объект, ключами которого сделаны функции. Пока их две: values и dateRange. Возвращает объект с двумя ключами: r - true, если что-то отфильтровалось и i - сами отфильтрованные объекты. Такие утлилиты сидят в объекте window, а значит их можно вызывать напрямую. Поэтому называются с большой буквы, чтобы не путать с локальными функциями.
    * FilterBy.values(items: any[], values: string[], field: string). Фильтрует поданные объекты по списку значений, чаще всего это id. Field умеет принимать dot notation.
    * FilterBy.dateRange(items: any[], dateRange: [Date, Date], field: string). Фильтрует поданные объекты по дате, попадающий в диапазон двух дат. Первая дата округляется на начало дня, вторая на конец. Поле даты в items может быть в любом формате: Date, Dayjs, string.
### Новые ноды:
* Новая молекула PopoverActionIcon v0(.1.0). Можно вставлять другие ноды. Они будут показываться во всплывающем окне при нажатии.
* Новый элемент DatePickerInput v0(.1.0). Позвоялет выбирать дату или период.
* Text v0(.3.0). Теперь можно выставлять ширину.
* ActionIcon v0(.2.0). Теперь умеет принимать статус loading и отображать на иконке loader.
* Table v0(.3.0). Переделан принцип работы с выбороб строк. Есть два вариант, теперь их можно включать оба одновременно:
    * Single row selectable: вариант выбора одной строки при нажатии на любое место в ней. Здесь есть дополнительные параметры. На выходе срабатывает сигнал selected и подается выбранный item: Selected item
    * Multiple row selectable: вариант выбора нескольких строк чекбоксами. На выходе нет сигнала, подаются выбранные item: Selected items.
* SegmentedControl v0(.2.0). Переведен к стандарту инпутов, заданному в Select v0.3.0

## 2023-08-05 v0.5.0
### Изменения нод:
#### App 0.3.0
 * Добавлено обновлние JWT после восстановления потеряной связи и автоматический выход для случая, когда пользователь смотрит на эркна, а JWT уже не валиден. Иначе бывают ситуации, когда кажется, что работает, а уже нет.
#### UseData 0.2.0
* Добавлен вид запроса Custom fetch. Fetch умеет фильтровать по точному совпадению по нескольким полям. Для более сложных запросов пока будем использовать Custom fetch. В query он принимает любой запрос в формте Elasticsearch. Пример, из-за которого возникла потребность. Нужно выдавать данные, у которых статус archived !== true. Такой запрос это решает:
    ```
    [{
        "bool": {
            "must_not": {
                "term": { "states.archived": true }
            }
        }
    }]
    ```

## 2023-08-05 v0.4.0
### Общие изменения:
* Версионность. Теперь про ноды. Наработался опыт изменения версий нод, стало понятно, что не удобно из-за каждого изменения создавать новую ноду в Noodl. Слишком муторно их менять. С другой стороны, нужно как то обезапаситься от ошибок. Берем на вооружение такой принципЖ
    * На уровне Noodl все ноды будут иметь только первую цифру версии, т.е. v0, v1 и т.д.
    * На уровне Rolder Kit, т.е. при его рахработке остаются полные версии из 3-х цифр. Нужно чтобы сохранялась история, чтобы откатиться, если что.
    * Таким образом, версия в Noodlбудет меняться только если есть изменения, которые нельзя совместить с предыдущей версией, которые ломают существующие ноды. Например, если переименован существующий порт, сама нода или изменился формат данных. Переходить будем постепенно. Первая нода: Select v0.
### Изменения нод:
#### Select v0(.4.0)
 * Теперь Select выдает на выход выбранный item. Output называется Selected item.
#### App 0.3.0
 * Исправлен баг, из-за которого новая авторизация выкидвала пользователя раньше положенного.
#### AppShell 0.1.0
 * В схеме параметр color теперь распознается не только для SideBar, но и для Header.

## 2023-08-05 v0.3.0
### Общие изменения:
* Версионность. Разобрался с версионностью. Теперь она приведена к общему подходу. К слову, это так же и для всех проектов, не только Rolder Kit. Принцип верисонирования:
    * Первая цифра: глобальные изменения. Например, переводя Раско на Noodl появится версия 2 как только выдадим клиенту первый набор функций. При этом, начинаем мы с цифры 0, как сейчас со Стартумом, а цифра 1 появится с полным выполнением ТЗ заказчика.
    * Вторая цифра: новые функции, доработки функций.
    * Третья цифра: исправление багов.
    * Соответсвенно, если исправили баги и добавили функйии, растет вторая цифра, если только баги, только последняя.
* В настроки Noodl добавлена версия проекта: Project version. Сейчас просто для удобства, когда Noodl прикрутит Github, будем использовать там. Удобство в том, что при debug=2, версия видна в консоли в объекте Rolder, что помогает не запутаться между вуерсиями dev, stage, prod.
* Уложился принцип использования сторонних библиотек. Все библиотеки называются с большой буквы, чтобы не путать с функциями. Внутри Rolder Kit они импортируются стнадартным способом. В Noodl часть из них подаются в объект window, что позволяет их вызывать напрямую. Сейчас это три библиотеки: Dayjs для работы с датами, Clone для глубоко клонирования объектов и Mustache для работы с шаблонами. Таким образом вызывать их нужно напрямую: Clone(), Dayjs() и т.д.

### Изменения нод:
#### App
* Доработана авторизация. Раньше авторизация обновлялась только с обновлением всей старнницы, сейчас обновляется каждый раз при активации вкладки или всего браузера. Принцип работы:
    * При авторизации Kuzzle возвращает JWT, который записываетсяв куки.
    * При некторых событиях JWT проверяется на актуальность и обновляется. Сравнивается время его жизни (в найстройках Noodl Session timout). Время еще есть, JWT из куки проверяется Kuzzle на валидность. Если JWT валидный и время не вышло, ползователь попадает в приложение, иначе в окно авторизации.
    * Есть три события, когда обрабатывается JWT: при авторизации он первый раз попадает в куки, при нициализации бекенда и активации окна он валидируется и обновляется.
    * Таким образом, если установить Session timout, скажем на 8 часов, то пользователь будет видеть окно авторизации каждое утро, т.к. за ночь JWT ни разу не обновится. Если же поставить на 24 часа, то пользователь будет проходить авторизацию после выходных.

## 2023-08-04 v0.2.0
### Общие изменения:
* Rolder Kit теперь написан на Typescript.
* Все инпуты сгруппированы по типам.

### Новые ноды:
* Новая молекула UnstyledButton. Используется когда какой-то компонент нужно превратить в кнопку. Пример: плитка уборки в Стартуме, в мобильной версии.
* Новая нода для обновления несколько объектов разом: mUpdate.

### Изменения нод:
#### App
* Изменен приницп работы со связями. Теперь свзяи нужно укзывать прямо в схеме классов. Пример:        
    ```
    [
        complex: {
            version: 1,
            subscribe: true,
            defaultSort: { 'content.name': 'asc' },
            defaultOptions: { size: 100 }
        },
        house: {
            version: 1,
            subscribe: true,
            references: ['complex'],
            defaultSort: { 'content.name': 'asc' },
            defaultOptions: { size: 100 }
        },
    ]
    ```
* Принцип работы. Каждый раз когда исползуется UseData, запускаются два сценария:
    * Запрашиваемый класс переберает все классы, проверяя есть ли они в references. Если есть, ищет совпадающие объекты каждого класса из references и вставляет их.
    * Запрашиваемый класс смотрит свои references, ищет совпадающие объекты для каждого и добавляет их.
* Таким образом, не важно какой класс загрузится первым, один из сценариев вставит объекты по связям. Например, если в примере выше complex загрузится первым, то связи проставятся, когда загрузится house, т.к. прописано references: ['complex'], т.е. первый сценарий. Если же house загрзуится первым, то связи проставятся, когда загрузится complex, т.к. он переберет все классы и найдет себя в references в классе house.
#### UseData
* Добавлен статус loading. Он есть у самой UseData и у объекта Noodl, в который UseData записывает данные.
* Поправлен баг, из-за которого не обновлялись данные при subcribe: true
* Убрана опция Set references
#### UseSearch v0.2.0
* За счет нового подхода к связям теперь проделывает такую работу с найденными данными:
    * Заменяет найденные объекты объектами Noodl, тем самым восстанавливая связи.
    * В соответсвии с параметром Database classes, добавляет в реузльтааты поиска свзязанные данные.
#### Шаблоны Mustache
* Добавлена возможность экранировать спец. символы. Если в выводимых данных есть кавычки или другие символы, нужно использовать тройные скобки: '{{{content.name}}}'. Это работает для таблицы и всех компонентов-инпутов, у которых есть поле "Label field".
#### Select v0.3.0
* Устаканился принцип работы. Этот же принцип постепенно будет использоовать в дргих компонентах такого типа. Теперь он может обрабатывать 2 типа данных: Items и Custom items. Items основной, здесь нужно использовать стандартный формат данных любого класса. Нужно просто подать массив данных, Select сам конвертирует в нужный формат. Второй тип данных ручной: Custom items. Его нужно использовать, когда данные для выбора требуется создать на месте, а не брать с базы. Формат должен быть такой:
    ```
    [
        {
            value: 'option1',
            label: 'Вариант 1'
        },
        {
            value: 'option2',
            label: 'Вариант 2'
        },    
    ]
    ```

## 2023-07-28 v0.1.2
### Общие изменения:
* Миша обнаружил проблему, некоторые ноды выдают ошибку, если какой то обязательный параметр пуст. Все ноды теперь обернуты в специальный wrapper, который берет параметр portsToCheck и проверяет заполнены ли эти параметры, если не заполненны прямо на старннице где раполоагется нода будет выдано предупреждение. Если вы увидели какую то ноду, которая выдает ошибку на какой то пустой параметр, сообщайте, буду добавлять проверку или дефолтное значение.
* Принял решение изменить название переменной класса БД. Была 'className', стала 'dbClass'. Слишком много пересченией с другими класами: клсаа js, класс css...
### Новые молекулы:
* Box. Box - единственная молекула, которая не имеет праметров в Mantine. Она принимает только sx. Для этого и создана - прикручивать любой css. Очень похожа на Group в Noodl. В нашем случае добавлены параметры высоты, ширины и автовысоты. Эта нода появилась из-за потребности упралять скролом, когда скрол всей странницы не подходит. Чтобы скрол заработал, нужно, чтобы дочерние ноды поддерживали скрол или нужно обернуть дочерние ноды Box в ScrollArea. Сейчас проверено на Table v0.2.0 Как использовать: нужно включить параметра Autoheigth и указать Bottom offset. Работает так: Box берет высоту экрана (portview), отнимает Bottom offset и задает фиксированную высоту, что и является требованием для включения скрола.
* Table v0.2.0:
    * Добавлена опция 'respectLineBreak' в схему таблицы. Эта опция нужна, если требуется сохранить переносы строк исходного текста. Пример использования:
        ```
        [
            {
                accessor: 'content.name',
                title: 'Название',
                width: '8rem',
            },
            {
                accessor: 'content.description',
                title: 'Описание',
                width: '8rem',
                props: {
                    respectLineBreak: true
                }
            }
        ]
        ```
    * Добавлена возможность использовать шаблоны доступа к данным поля. Для этого используется библиоткека Mustache. Пример использования:
        ```
        [{
            accessor: 'Уважаемый {{content.firstName}} {{content.lastName}}, еще текст...',
            title: 'ФИО',
            width: '8rem',
        }]    
        ```
    * Добавлена проверка, что схема таблицы не пуста.
    * Теперь таблица не ждет структуры данных, для которой нужно указывать класс БД. В нее нужно подавать массив объектов.
* UseData v0.2.0 Добавлена проверка, что класс БД указан.