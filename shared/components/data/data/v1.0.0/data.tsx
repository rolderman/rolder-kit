import { forwardRef, lazy, useEffect, useState } from "react"
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query"
import React from "react"
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
import { MutationFnProps, Props } from "./types"
import { Loader } from "@mantine/core"
import { PersistQueryClientProvider, PersistedClient, Persister } from '@tanstack/react-query-persist-client'
import { get, set, del } from "idb-keyval";
import { getKuzzle } from '@shared/get-kuzzle';
import { onlineManager } from '@tanstack/react-query'
import setOnlineState from "./src/setOnlineState"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            //refetchOnWindowFocus: "always",
            refetchOnMount: "always"
        },
        mutations: {
            cacheTime: 1000 * 60 * 60 * 72,
            retry: true,
        },
    },
})

queryClient.setMutationDefaults([], {
    mutationFn: async (props: MutationFnProps) => {
        const K = await getKuzzle()
        if (!K) return

        const { dbName } = R.env
        if (!dbName) {
            R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
            log.error('No dbName', R.env)
            return
        }

        const r = await K.query({ controller: 'rolder', action: props.action, dbName, scheme: props.scheme })
        const data = r.result
        const dataEntries = Object.entries(data)
        if (dataEntries.some(i => i[1].error)) {
            dataEntries.forEach(entry => {
                if (entry[1]?.error) {
                    R.libs.mantine?.MantineError('Системная ошибка!', `create error at "${entry[0]}": ${entry[1]?.error}`)
                    log.error(`create error at "${entry[0]}": ${entry[1]?.error}`)
                }
            })
        }

        return data
    }
});

export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
    return {
        persistClient: async (client: PersistedClient) => {
            set(idbValidKey, client);
        },
        restoreClient: async () => {
            return await get<PersistedClient>(idbValidKey);
        },
        removeClient: async () => {
            await del(idbValidKey);
        },
    } as Persister;
}

const ReactQueryDevtoolsProduction = lazy(() =>
    import('@tanstack/react-query-devtools/production').then((d) => ({
        default: d.ReactQueryDevtools,
    })),
)

function Mutation(props: any) {
    const mutation = useMutation([])

    //@ts-ignore
    R.libs.mutate = mutation.mutateAsync

    return <>{props.children}</>
}

export default forwardRef(function (props: Props) {
    const { backendVersion, dbName, persistData, backendDevMode, backendUrl, backendPort, downlink } = props
    const { project } = Noodl.getProjectSettings()

    R.env.backendVersion = backendVersion
    R.env.dbName = dbName
    R.libs.queryClient = queryClient

    const [initState, setInitState] = useState<typeof R.states.backend>(R.states.backend)

    useEffect(() => {
        if (initState === 'notInitialized') {
            setOnlineState(props.noodlNode).then(() => {
                R.states.backend = 'initializing'
                setInitState('initializing')
            })
        }

        onlineManager.setEventListener(() => {
            //@ts-ignore
            if (initState === 'notInitialized') return () => {
                //@ts-ignore
                const connection = navigator.connection
                if (connection) {
                    connection.onchange = () => setOnlineState(props.noodlNode)
                    //if (Capacitor.getPlatform() === 'android') connection.ontypechange = networkQualityCheck
                }

                //Network.addListener('networkStatusChange', () => setOnlineState(props.noodlNode))
            }
        })
    }, [initState])

    useEffect(() => {
        if (!project || !backendVersion) {
            log.error('Kuzzle init: empty required props', { project, backendVersion })
            return
        }

        if (!R.libs.Kuzzle) {
            if (initState === 'initializing') {
                const startTime = log.start()

                const kuzzle = new Kuzzle(
                    new WebSocket(
                        backendDevMode
                            ? backendUrl
                            : `${project}.kuzzle.${backendVersion}.rolder.app`,
                        { port: backendDevMode ? backendPort : 443 }
                    )
                )
                kuzzle.autoReconnect = false
                R.libs.Kuzzle = kuzzle

                if (onlineManager.isOnline()) {
                    kuzzle.connect().then(() => {
                        R.states.backend = 'initialized'
                        setInitState('initialized')

                        log.end('Kuzzle online init', startTime)
                        log.info('R', R)
                    })
                } else {
                    R.states.backend = 'initialized'
                    setInitState('initialized')

                    log.end('Kuzzle offline init', startTime)
                    log.info('R', R)
                }
            }
        }
    }, [project, backendVersion, initState])

    return persistData ?
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: createIDBPersister(),
                maxAge: 1000 * 60 * 60 * 72,
                buster: R.env.projectVersion,
            }}
            onSuccess={() => { if (R.libs.Kuzzle?.authenticated) queryClient.resumePausedMutations() }}
        >
            {initState === 'initialized'
                ? <Mutation>{props.children}</Mutation>
                : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                    <Loader color="dark" size='xl' />
                </div>}
            {R.states.debug
                ? <React.Suspense fallback={null}>
                    <ReactQueryDevtoolsProduction />
                </React.Suspense>
                : null}
        </PersistQueryClientProvider>
        : <QueryClientProvider
            client={queryClient}
        >
            {initState === 'initialized'
                ? <Mutation>{props.children}</Mutation>
                : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                    <Loader color="dark" size='xl' />
                </div>}
            {R.states.debug
                ? <React.Suspense fallback={null}>
                    <ReactQueryDevtoolsProduction />
                </React.Suspense>
                : null
            }
        </QueryClientProvider>
})