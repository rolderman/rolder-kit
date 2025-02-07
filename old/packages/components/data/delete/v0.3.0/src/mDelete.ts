import { dbClassVersion } from '@packages/get-dbclass-version'
import { getKuzzle } from '@packages/get-kuzzle'
import type { ArgsDocumentControllerCreate } from 'kuzzle-sdk'
import type { DeleteScheme } from '../types'

export default async (deleteScheme: DeleteScheme) => {
	const K = await getKuzzle()
	if (!K) return

	const { dbName } = R.env
	if (!dbName) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`)
		log.error('No dbName', R.env)
		return
	}

	const { dbClass, ids } = deleteScheme

	const options: ArgsDocumentControllerCreate = { refresh: 'wait_for' }
	const dbClassV = dbClassVersion(dbClass)

	const startTime = log.start()
	log.info(`mDelete ${dbClassV} props`, { ids })

	if (dbName && dbClassV)
		await K.document
			.mDelete(dbName, dbClassV, ids, { ...options, retryOnConflict: 3 })
			.then((kResponse) => {
				log.info(`${dbClassV} mDeleted`, kResponse)
				log.end(`${dbClassV} mDelete`, startTime)
			})
			.catch((error) => {
				R.libs.mantine?.MantineError?.('Системная ошибка!', `Kuzzle mDelete ${dbClassV}: ${error.message}`)
				log.error(`Kuzzle mDelete ${dbClassV}:`, error)
			})
}
