import React, {useEffect, useState} from 'react'
import {TTimeAgg} from '../types/time-agg.type.ts'
import {aggregateForPeriod} from './aggregate-for-period.function.ts'
import {ETimeAggregation} from '../enums/ETimeAggregation.ts'
import {SelectRadio} from '../select-radio/select-radio.tsx'

export enum ETimeAggregationOptionsAggregation {
    NO_AGG = 'Без агрегации',
    MINUTE = 'Минуты',
    HOUR = 'Часы',
    DAY = 'День',
    WEEK = 'Неделя',
    MONTH = 'Месяц',
    YEAR = 'Год',
}

interface IProps {
    timeAgg: TTimeAgg,
    setTimeAgg: any
}

const timeAggregationResolver = {
    'NO_AGG': 'Без агрегации',
    'MINUTE': 'Минуты',
    'HOUR': 'Часы',
    'DAY': 'День',
    'WEEK': 'Неделя',
    'MONTH': 'Месяц',
    'YEAR': 'Год',
    'Без агрегации': 'NO_AGG',
    'Минуты': 'MINUTE',
    'Часы': 'HOUR',
    'День': 'DAY',
    'Неделя': 'WEEK',
    'Месяц': 'MONTH',
    'Год': 'YEAR',
}

const Aggregation: React.FC<IProps> = ({
                                           timeAgg,
                                           setTimeAgg,
                                       }) => {

    const listAggregation: ETimeAggregationOptionsAggregation[] = aggregateForPeriod(timeAgg.startDash, timeAgg.endDash)
    const haveAgg = listAggregation.find((item) => item === timeAggregationResolver[timeAgg.aggregation])
        ? timeAggregationResolver[timeAgg.aggregation] as ETimeAggregationOptionsAggregation
        : listAggregation.length
            ? listAggregation[0]
            : ETimeAggregationOptionsAggregation.NO_AGG
    const [aggregation, setAggregation] = useState<ETimeAggregationOptionsAggregation>(haveAgg)

    useEffect(() => {
        setAggregation(haveAgg)
    }, [haveAgg])

    useEffect(() => {
        setTimeAgg({...timeAgg, aggregation: timeAggregationResolver[aggregation] as ETimeAggregation})
    }, [aggregation])

    return (
        <SelectRadio option={listAggregation} value={aggregation} setValue={setAggregation as (value: string) => void}
                     height={40}/>
    )
}


export default Aggregation
