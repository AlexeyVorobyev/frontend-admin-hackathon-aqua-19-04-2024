import {FC} from 'react'
import {AlexBigCalendar} from '../../../shared-react-components/AlexBigCalendar/AlexBigCalendar.tsx'
import {useAlexPageState} from '../../../shared-react-components/functions/useAlexPageState/useAlexPageState.tsx'
import {getRandomInt} from '../users/columns.data.tsx'

export const PageCalendar: FC = () => {
    const {
        variables,
        storedOptions,
        setStoredOptions,
    } = useAlexPageState({
        defaultValue: new Map([
            ['date', new Date()],
        ] as [string, any][]),
    })

    return (<>
        <AlexBigCalendar
            storedOptions={storedOptions}
            setServerSideOptions={setStoredOptions}
            data={Array(1000).fill(1).map(() => ({
                id: getRandomInt(100000).toString(),
                name: 'День рождения',
                date: new Date(Date.parse((new Date()).toString()) - Math.random()*(1e+12))
            }))}/>
    </>)
}