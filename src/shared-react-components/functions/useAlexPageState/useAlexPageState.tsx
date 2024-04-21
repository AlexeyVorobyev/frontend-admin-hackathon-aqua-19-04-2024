import {useLocation, useSearchParams} from 'react-router-dom'
import {Dispatch, SetStateAction, useCallback, useEffect, useLayoutEffect, useState} from 'react'
import {reviver} from './json-functions/reviver.ts'
import {replacer} from './json-functions/replacer.ts'

export enum EUsePageStateMode {
    queryString = 'QUERY_STRING',
    sessionStorage = 'SESSION_STORAGE',
    localStorage = 'LOCAL_STORAGE',
}

export type TStoredOptions = Map<string, any>
export type TSetStoredOptions = Dispatch<SetStateAction<TStoredOptions>>

interface IProps {
    varsBehaviorMap?: (params: any) => Record<string, any> | null
    modeRead?: EUsePageStateMode[],
    modeWrite?: EUsePageStateMode[],
    storageKey?: string
    defaultValue?: TStoredOptions
}

const DEBUG = true

export const useAlexPageState = <
    Variables extends Record<string, any> | null
>({
      varsBehaviorMap,
      modeRead = [],
      modeWrite = [],
      storageKey = 'pageState',
      defaultValue = new Map([]) as TStoredOptions
  }: IProps) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()

    const initialSetStoredOptions = useCallback((modeList: EUsePageStateMode[]) => {
        let mode: EUsePageStateMode | undefined = undefined

        for (const item of modeList) {
            if (item === EUsePageStateMode.sessionStorage || item === EUsePageStateMode.localStorage) {
                const stringValue = item === EUsePageStateMode.sessionStorage
                    ? sessionStorage.getItem(storageKey)
                    : localStorage.getItem(storageKey)
                if (stringValue) {
                    mode = item
                    break
                }
            } else if (item === EUsePageStateMode.queryString) {
                if (Array.from(searchParams.entries()).length) {
                    mode = item
                    break
                }
            }
        }

        try {
            if (mode === EUsePageStateMode.queryString) {
                const queryStringState = new Map(
                    Array.from(searchParams.entries())
                        .map((param) => [param[0], JSON.parse(param[1], reviver)])
                )
                return new Map([...defaultValue, ...queryStringState]) as TStoredOptions
            } else if (mode === EUsePageStateMode.sessionStorage || mode === EUsePageStateMode.localStorage) {
                const stringValue = mode === EUsePageStateMode.sessionStorage
                    ? sessionStorage.getItem(storageKey)
                    : localStorage.getItem(storageKey)
                return stringValue
                    ? new Map([...defaultValue, ...JSON.parse(stringValue, reviver)]) as TStoredOptions
                    : defaultValue
            } else {
                return defaultValue
            }
        } catch (e) {
            return defaultValue
        }

    }, [modeRead, defaultValue, localStorage, sessionStorage, storageKey])

    // синхронизация состояний storage -> storedOptions при моунте
    const [storedOptions, setStoredOptions] = useState<TStoredOptions>(initialSetStoredOptions(modeRead)!)

    const [processedParams, setProcessedParams] = useState<Variables>(
        varsBehaviorMap
            ? varsBehaviorMap(Object.fromEntries(storedOptions)) as Variables
            : Object.fromEntries(storedOptions) as Variables
    )

    // синхронизация состояний storedOptions -> storage
    useLayoutEffect(() => {
        DEBUG && console.debug('current storedOptions state', storedOptions, storageKey)
        if (modeWrite?.includes(EUsePageStateMode.queryString)) {
            setSearchParams(new URLSearchParams(
                Array.from(storedOptions)
                    .map((param) => [param[0], JSON.stringify(param[1], replacer)]),
            ))
        }
        if (modeWrite?.includes(EUsePageStateMode.sessionStorage)) {
            sessionStorage.setItem(storageKey, JSON.stringify(storedOptions, replacer))
        }
        if (modeWrite?.includes(EUsePageStateMode.localStorage)) {
            localStorage.setItem(storageKey, JSON.stringify(storedOptions, replacer))
        }
    }, [storedOptions, location.search])

    useEffect(() => {
        if (varsBehaviorMap) {
            setProcessedParams(varsBehaviorMap(Object.fromEntries(storedOptions)) as Variables)
        } else {
            setProcessedParams(Object.fromEntries(storedOptions) as Variables)
        }
    }, [storedOptions])

    return {
        variables: processedParams,
        storedOptions: storedOptions,
        setStoredOptions: setStoredOptions
    }
}
