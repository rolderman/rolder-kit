declare global {
    interface Window {
        Rolder: RolderType
        Noodl: any
        Kuzzle: Kuzzle
        QueryClient: any
        Clone: any;
        Dayjs: any;
        Mustache: any
        FilterBy: {
            values: Function
            dateRanfe: Function
        }
    }
}

declare type DbClass = {
    version: number,
    subscribe: boolean
    references: string[]
    defaultSort: {
        ['asc' | 'desc']: string
    },
    defaultOptions: {
        size: number
    }
}

declare type RolderType = {
    rolderKit: string
    inited: boolean
    authenticated?: boolean
    project: string
    projectVersion: string
    envVersion: string
    dbVersion: number
    dbClasses: {
        [key: string]: DbClass
    }
    debug: number
    sessionTimeout: string
}

declare type JsNode = {
    [key: string]: {
        nodeImport: any
        inputs?: any
        outputs?: any
        //inputsToCheck?: string[]
        //inputRules?: { condition: string, inputs: string[] }[]
    }
}

declare type RNode = {
    [key: string]: {
        ReactComp: (props: any) => JSX.Element
        allowChildren?: boolean
        reqiereChildren?: boolean
        inputs?: any
        outputs?: any
        inputsToCheck?: string[]
        inputRules?: InputRule[]
    }
}

declare type JsNodeProps = {
    [key: string]: NodeInput,
} | undefined

declare type InputRule = { condition: string, inputs: string[] }

declare type NoodlEnum = {
    [key: string]: {
        label: string
        value: string
    }[]
}