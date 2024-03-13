import { Props, UpdateScheme, UpdateUser } from './types';
import { sendOutput, sendSignal } from '@shared/port-send';
import unique from 'just-unique';
import map from 'just-map-object';
import isEmpty from '@shared/is-empty';
import mUpdate from './src/mUpdate';
import updateUser from './src/updateUser';
import { Item } from '@shared/types';

export default {
  async update(props: Props) {
    const { noodlNode, updateScheme } = props

    sendOutput(noodlNode, 'updating', true)

    const orders = unique(updateScheme.map(i => i.order)).sort()
    const updatePromise = (scheme: UpdateScheme) => mUpdate(scheme)
    const updateUserPromise = (scheme: UpdateUser) => updateUser(scheme)
    const schemeArrays = orders.map(order => {
      return updateScheme.filter(i => i.order === order)
    })

    async function executeArrays() {
      let results: any = {};
      for (const schemeArray of schemeArrays) {
        const arrayResults = await Promise.all(schemeArray.map((scheme: UpdateScheme) => {
          // save refId for next order            
          if (scheme.items.some(i => !isEmpty(i.refId))) {
            results[scheme.dbClass] = scheme.items.map(i => ({ refId: i.refId }))
            scheme.items = scheme.items.map(i => {
              delete i.refId
              return i
            })
          }
          // add ref from prev order            
          scheme.items.forEach((item: any) => {
            map(item, (k, v: any) => {
              if (!isEmpty(v.refId)) {
                const refId = results[k]?.find((i: any) => i.refId === v.refId)?.id
                if (refId) item[k] = { id: refId }
                delete v.refId
              }
            })
          })
          if (scheme.dbClass === 'user') return Promise.all(scheme.items.map((user: any, idx) => updateUserPromise(user).then(user => ({
            ...user, refId: results[scheme.dbClass]?.[idx].refId
          }))))
          else return updatePromise(scheme).then(items => items?.map((i, idx) => ({
            ...i, refId: results[scheme.dbClass]?.[idx].refId
          })))
        }))

        schemeArray.forEach((scheme: UpdateScheme, idx: number) => results[scheme.dbClass] = arrayResults[idx])
      }

      map(results, (dbClass, items: Item[]) => {
        results[dbClass] = items.map(i => {
          delete i.refId
          return i
        })
      })

      //@ts-ignore
      sendOutput(noodlNode, 'updatedData', results)
      sendSignal(noodlNode, 'updated')
      sendOutput(noodlNode, 'updating', false)
    }

    executeArrays().catch((error) => log.error('update error', error))
  }
}