import React, { FC, useMemo, useState } from 'react'
import { IconButton, Popover, Tooltip } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import { AlexFiltersFormContext } from './AlexFiltersFormContext'
import { AlexFilter, IAlexFilter } from './AlexFilter'
import {AlexDialog} from '../AlexDialog/AlexDialog.tsx'

interface IProps {
    filterListIds: (string | [string, string])[]
    storedOptions: Map<string, any>
    setServerSideOptions: React.Dispatch<React.SetStateAction<Map<string, any>>>
    filtersMap: Map<string, IAlexFilter>
}

const DEBUG = true
const DEBUG_PREFIX = 'ALEX_FILTERS'

export const AlexFiltersDialog: FC<IProps> = ({
                                            filterListIds,
                                            storedOptions,
                                            setServerSideOptions,
                                            filtersMap,
                                        }) => {
    DEBUG && console.log(DEBUG_PREFIX, 'filterListIds', filterListIds)
    const [open, setOpen] = useState<boolean>(false)

    const renamedIds = useMemo(() => filterListIds.map((item) => Array.isArray(item) ? item[1] : item),[filterListIds])
    const initialIds = useMemo(() => filterListIds.map((item) => Array.isArray(item) ? item[0] : item),[filterListIds])

    return (<>
        <Tooltip title={'Фильтры'}>
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setOpen(true)
            }}>
                <TuneIcon color={'secondary'}/>
            </IconButton>
        </Tooltip>
        <AlexDialog
            title={'Фильтры'}
            open={open}
            setOpen={setOpen}
        >
            <AlexFiltersFormContext setAnchorEl={() => setOpen(false)} setStoredOptions={setServerSideOptions}
                                    storedOptions={storedOptions} filterListIds={renamedIds} minWidth={'0px'}>
                {initialIds.map((id, index) => {
                    const config = filtersMap.get(id)
                    if (config) {
                        return <AlexFilter config={config} id={renamedIds[index]} key={renamedIds[index]}/>
                    } else {
                        return `Некорректный id фильтра ${id}`
                    }
                })}
            </AlexFiltersFormContext>
        </AlexDialog>
    </>)
}