const libs: any = {}

// dayjs
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(dayOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(weekday)
dayjs.extend(weekYear)
dayjs.extend(weekOfYear)
dayjs.extend(timezone)
dayjs.locale('ru')
libs.dayjs = dayjs

import capitalize from 'just-capitalize'
import clone from 'just-clone'
import flush from 'just-flush'
import insert from 'just-insert'
import last from 'just-last'
import map from 'just-map-object'
import omit from 'just-omit'
import range from 'just-range'
import safeGet from 'just-safe-get'
import safeSet from 'just-safe-set'
import sortBy from 'just-sort-by'
// just
import typeOf from 'just-typeof'
import unique from 'just-unique'
libs.just = { typeOf, clone, flush, omit, insert, map, capitalize, range, last, unique, sortBy, get: safeGet, set: safeSet }

// form
import { hasLength, isEmail, isInRange, isNotEmpty, matches, matchesField } from '@mantine/form'
libs.form = { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField }

// numbro
import numbro from 'numbro'
//@ts-ignore
import locale from 'numbro/dist/languages/ru-RU.min.js'
locale.delimiters.decimal = '.'
numbro.registerLanguage(locale)
numbro.setLanguage('ru-RU')
libs.numbro = numbro

import { sort } from 'fast-sort'
libs.sort = sort
import generatePassword from 'omgopass'
libs.generatePassword = generatePassword
import deepEqual from 'fast-deep-equal'
libs.deepEqual = deepEqual

import { del, delMany, get, getMany, keys, set, setMany, update } from 'idb-keyval'
libs.indexedDb = { get, getMany, set, setMany, update, del, delMany, keys }

import { nanoid } from 'nanoid'
libs.nanoid = nanoid

export default libs
