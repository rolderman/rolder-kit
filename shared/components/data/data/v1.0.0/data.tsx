import { forwardRef, lazy, useEffect, useState } from "react"
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query"
import React from "react"
import { Kuzzle, WebSocket } from 'kuzzle-sdk'
import { MutationFnProps, Props } from "./types"
import { Loader } from "@mantine/core"
import { sendOutput } from "@shared/port-send"
import { Network } from "@capacitor/network"
import { PersistQueryClientProvider, PersistedClient, Persister } from '@tanstack/react-query-persist-client'
import { get, set, del } from "idb-keyval";
import { getKuzzle } from '@shared/get-kuzzle';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: "always",
            refetchOnMount: "always"
        },
    },
})

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
    const mutation = useMutation({
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
    })

    R.libs.mutate = mutation.mutateAsync

    return <>{props.children}</>
}

export default forwardRef(function (props: Props) {
    const { backendVersion, dbName, persistData, backendDevMode, backendUrl, backendPort } = props
    const { project } = Noodl.getProjectSettings()

    R.env.backendVersion = backendVersion
    R.env.dbName = dbName
    R.libs.queryClient = queryClient

    const [online, setOnline] = useState(R.states.online)
    const [initState, setInitState] = useState<typeof R.states.backend>(R.states.backend)

    useEffect(() => {
        Network.getStatus().then(state => {
            R.states.online = state.connected
            if (initState === 'notInitialized') {
                R.states.backend = 'initializing'
                setOnline(state.connected)
                setInitState('initializing')
                //@ts-ignore
                sendOutput(props.noodlNode, 'isOnline', state.connected)
            }
        })

        Network.addListener('networkStatusChange', async state => {
            R.states.online = state.connected
            setOnline(state.connected)
            if (state.connected) R.libs.queryClient?.invalidateQueries()
            //@ts-ignore
            sendOutput(props.noodlNode, 'isOnline', state.connected)
            log.info('Network status changed', state)
        })

        return () => { Network.removeAllListeners() }
    }, [])

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
                R.libs.Kuzzle = kuzzle

                if (online) {
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

                let reconnectTime = 0
                kuzzle.on('disconnected', (...args: any) => {
                    reconnectTime = log.start()
                    log.info('Kuzzle disconnected', args)
                })
                kuzzle.on('reconnected', () => { log.end('Kuzzle reconnected', reconnectTime) })
            }
        }
    }, [project, backendVersion, initState])

    return persistData ?
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: createIDBPersister(),
                maxAge: 1000 * 60 * 60 * 24,
                buster: R.env.projectVersion,
            }}
        >
            {initState === 'initialized'
                ? <Mutation>{props.children}</Mutation>
                : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                    <Loader color="dark" size='xl' />
                </div>}
            {R.states.debug && <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction />
            </React.Suspense>}
        </PersistQueryClientProvider>
        : <QueryClientProvider
            client={queryClient}
        >
            {initState === 'initialized'
                ? <Mutation>{props.children}</Mutation>
                : <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-28px', marginLeft: '-28px' }}>
                    <Loader color="dark" size='xl' />
                </div>}
            {R.states.debug && <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction />
            </React.Suspense>}
        </QueryClientProvider>
})